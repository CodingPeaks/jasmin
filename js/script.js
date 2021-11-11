var nagiosData;
var selectedServer = -1;
const updateInterval = 5; //seconds
var host_status_filter = null;
var service_status_filter = null;

var total = {
    "host": {
        "up": 0,
        "down": 0,
        "unreachable": 0,
        "pending": 0,
        "problems": 0,
        "all": 0
    },
    "service": {
        "ok": 0,
        "warning": 0,
        "unknown": 0,
        "critical": 0,
        "pending": 0,
        "problems": 0,
        "all": 0
    }
}

async function fetchNagiosData() {
    const response = await fetch('/jasmin/main.php');
    const data = await response.json();
    return data;
}

function fetchAll() {

    fetchNagiosData().then(data => {
        console.log(data);
        buildServerSelects(data);
        buildMonitoringInterface();
        updateMonitoringInterface();
        setInfo();
    });

}

function filterHosts(hosts, state) {
    return hosts.filter(host => host.current_state == state);
}

function filterServices(services, state) {
    return services.filter(service => service.current_state == state);
}

function buildServerSelects(data) {
    var html = `<option value="-1" selected>All Servers</option>`;
    for (var i = 0; i < data.length; i++) {
        var server = data[i].server;
        html += `<option value="${i}" >${server.name} (${server.host})</option>`;
    }
    $("select").html(html);

    nagiosData = data;
}

function buildMonitoringInterface() {
    var html = ``;
    var data = (selectedServer >= 0) ? nagiosData.filter((value, index) => index == selectedServer) : nagiosData;
    for (var i = 0; i < data.length; i++) {
        html += fetchHosts(data[i]);
    }
    $(".main").html(html);
}

function updateMonitoringInterface() {
    setInfo();
    fetchNagiosData().then(response => {

        Object.keys(total.host).forEach(v => total.host[v] = 0);
        Object.keys(total.service).forEach(v => total.service[v] = 0);
        var html = ``;
        var data = (selectedServer >= 0) ? response.filter((value, index) => index == selectedServer) : response;
        for (var i = 0; i < data.length; i++) {
            html += fetchHosts(data[i]);
        }
        $(".main").html(html);
        setTimeout(function () { updateMonitoringInterface(); }, updateInterval * 1000);
    });
}

function fetchHosts(data) {
    var hosts = data.hosts;
    var services = data.services;
    var server = data.server;

    updateHostTotals(hosts);

    if (host_status_filter != null) {
        hosts = filterHosts(hosts, host_status_filter);
    }

    var html = `<div class="row server-card">
                <div class="col-lg-12 col-12">
                    <div class="row sticky-server-header">
                        <div class="col-lg-12 col-12 server-header">${server.name} - ${server.host}</div>
                    </div>
                    <div class="row header">
                        <div class="col-lg-1 col-4 pr-0">Host</div>
                        <div class="col-lg-1 col-4 pr-0">Service</div>
                        <div class="col-lg-1 col-4 pr-0">Status</div>
                        <div class="col-lg-1 d-none d-sm-flex pr-0 pl-0 flex-horizontal-center flex-vertical-center">Last Check</div>
                        <div class="col-lg-1 d-none d-sm-flex pr-0 pl-0 flex-horizontal-center flex-vertical-center">Duration</div>
                        <div class="col-lg-1 d-none d-sm-flex pr-0 pl-0 flex-horizontal-center flex-vertical-center">Next Check</div>
                        <div class="col-lg-1 d-none d-sm-flex pr-0 pl-0 flex-horizontal-center flex-vertical-center">Attempt</div>
                        <div class="col-lg-5 d-none d-sm-flex pr-0">Status Information</div>
                    </div>`;

    console.log(server.name);

    for (var host in hosts) {
        console.log(hosts[host]);
        var host_name = hosts[host].host_name;
        html += fetchServices(hosts[host], services[host_name]);
    }

    html += `</div></div>`;

    return html;
}

function fetchServices(host, services) {
    var html = ``;
    var first_row = true;

    updateServiceTotals(services);

    if (service_status_filter != null) {
        services = filterServices(services, service_status_filter);
    }

    if (services.length) {
        for (var service in services) {
            var service_status = services[service].current_state;
            var last_check = Number(services[service].last_check);
            service_status = (last_check == 0) ? 4 : service_status;
            var host_col = (first_row) ? `<div class="col-lg-1 col-4 flex-vertical-center host-border host-state-${host.current_state}">${host.host_name}</div>` : ``;
            var col_offset = (!first_row) ? `offset-lg-1 offset-4` : ``;
            var host_divider = (first_row) ? `host-divider` : ``;
            var duration = Number(services[service].last_update) - Number(services[service].last_state_change);
            duration = new Date(duration * 1000).toISOString().substr(11, 8);
            var next_check = Number(services[service].next_check);
            var attempt = services[service].current_attempt + "/" + services[service].max_attempts;
            var status_information = services[service].plugin_output;
            var service_name = services[service].service_description

            html += `<div class="row monitor ${host_divider}">
                    ${host_col}
                    <div class="col-lg-1 col-4 ${col_offset} pr-0 flex-vertical-center service-state-${service_status}">${service_name}</div>
                    <div class="col-lg-1 col-4 pr-2 pl-1 flex-vertical-center service-state-${service_status}">
                        ${serviceStatus(service_status)}
                    </div>
                    <div class="col-lg-1 d-none d-sm-flex pr-0 pl-0 flex-horizontal-center flex-vertical-center service-state-${service_status}">
                        ${(last_check == 0) ? "N/A" : getFormattedDate(last_check)}
                    </div>
                    <div class="col-lg-1 d-none d-sm-flex pr-0 pl-0 flex-horizontal-center flex-vertical-center service-state-${service_status}">
                        ${duration}
                    </div>
                    <div class="col-lg-1 d-none d-sm-flex pr-0 pl-0 flex-horizontal-center flex-vertical-center service-state-${service_status}">
                        ${getFormattedDate(next_check)}
                    </div>
                    <div class="col-lg-1 d-none d-sm-flex pr-0 pl-0 flex-horizontal-center flex-vertical-center service-state-${service_status}">
                        ${attempt}
                    </div>
                    <div class="col-lg-5 d-none d-sm-flex pr-0 flex-vertical-center service-state-${service_status}">
                        ${status_information}
                    </div>
                 </div>`;

            var first_row = false;
        }
    } else {
        //html += `<div class="row monitor host-divider"><div class="col-lg-1 col-4 flex-vertical-center host-border host-state-${host.current_state}">${host.host_name}</div></div>`;
    }


    return html;
}

function updateHostTotals(hosts) {

    for (var host in hosts) {
        var state = hosts[host].current_state;
        total.host.all++;

        switch (state) {
            case "0":
                total.host.up++;
                break;

            case "1":
                total.host.down++;
                total.host.problems++;
                break;

            case "2":
                total.host.unreachable++;
                total.host.problems++;
                break;
        }


        $("#host_types_total").val(total.host.all);
        $("#host_up_total").val(total.host.up);
        $("#host_down_total").val(total.host.down);
        $("#host_unreachable_total").val(total.host.unreachable);
        $("#host_pending_total").val(total.host.pending);
        $("#host_problems_total").val(total.host.problems);

        if (total.host.up) {
            $("#host_up_total").css({ "background": "#16cf16", "color": "white" });
        } else {
            $("#host_up_total").css({ "background": "white", "color": "black" });
        }

        if (total.host.down) {
            $("#host_down_total").css({ "background": "#dc3545", "color": "white" });
        } else {
            $("#host_down_total").css({ "background": "white", "color": "black" });
        }

        if (total.host.problems) {
            $("#host_problems_total").css({ "background": "#1eb9ff", "color": "white" });
        } else {
            $("#host_problems_total").css({ "background": "white", "color": "black" });
        }
    }

}

function updateServiceTotals(services) {

    for (var service in services) {
        var state = services[service].current_state;
        total.service.all++;

        switch (state) {
            case "0":
                total.service.ok++;
                break;

            case "1":
                total.service.warning++;
                total.service.problems++;
                break;

            case "2":
                total.service.critical++;
                total.service.problems++;
                break;
        }


        $("#service_types_total").val(total.service.all);
        $("#service_ok_total").val(total.service.ok);
        $("#service_warning_total").val(total.service.warning);
        $("#service_critical_total").val(total.service.critical);
        $("#service_unknown_total").val(total.service.unknown);
        $("#service_pending_total").val(total.service.pending);
        $("#service_problems_total").val(total.service.problems);


        if (total.service.ok) {
            $("#service_ok_total").css({ "background": "#16cf16", "color": "white" });
        } else {
            $("#service_ok_total").css({ "background": "white", "color": "black" });
        }

        if (total.service.warning) {
            $("#service_warning_total").css({ "background": "#e2cd0f", "color": "black" });
        } else {
            $("#service_warning_total").css({ "background": "white", "color": "black" });
        }

        if (total.service.critical) {
            $("#service_critical_total").css({ "background": "#dc3545", "color": "white" });
        } else {
            $("#service_critical_total").css({ "background": "white", "color": "black" });
        }

        if (total.service.problems) {
            $("#service_problems_total").css({ "background": "#1eb9ff", "color": "white" });
        } else {
            $("#service_problems_total").css({ "background": "white", "color": "black" });
        }
    }

}

function serviceStatus(current_state) {
    var states = {
        "0": {
            "text": "OK",
            "bgColor": "bg-success",
            "color": "text-white"
        },

        "1": {
            "text": "WARNING",
            "bgColor": "bg-warning",
            "color": "text-dark"
        },

        "2": {
            "text": "CRITICAL",
            "bgColor": "bg-danger",
            "color": "text-white"
        },

        "3": {
            "text": "UNKNOWN",
            "bgColor": "bg-secondary",
            "color": "text-white"
        },
        "4": {
            "text": "PENDING",
            "bgColor": "bg-secondary",
            "color": "text-white"
        }
    }

    return `<div class="status-label ${states[current_state].bgColor} ${states[current_state].color}">${states[current_state].text}</div>`;
}


function getFormattedDate(timestamp) {
    var date = new Date(timestamp * 1000);

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

    return str;
}

function getCurrentFormattedDate() {
    var date = new Date();

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

    return str;
}

function setInfo() {
    $("#update_interval").html(updateInterval);
    $("#last_updated").html(getCurrentFormattedDate());
}

$('select').on('change', function () {
    selectedServer = Number(this.value);
    buildMonitoringInterface();
});




$(function() {
    fetchAll();

    $('.host-total-filter').on('click', function () {
        host_status_filter = $(this).data("state");
        updateMonitoringInterface();
    });

    $('.service-total-filter').on('click', function () {
        service_status_filter = $(this).data("state");
        updateMonitoringInterface();
    });

    $('#host_types_total').on('click', function () {
        host_status_filter = null;
        updateMonitoringInterface();
    });

    $('#service_types_total').on('click', function () {
        service_status_filter = null;
        updateMonitoringInterface();
    });
    
});