
[![Just A Simple Monitoring Interface for Nagios](https://raw.githubusercontent.com/CodingPeaks/jasmin/master/img/white_logo.png)](https://github.com/CodingPeaks/jasmin)
## ***Just A Simple Monitoring Interface for Nagios***

Monitor hosts and services of multiple Nagios Core servers in real time in a simple web interface.

## 📎 Menu
- 📷 [About Project](#-about-project)
- 🙌 [Features](#-features)
- 🔨 [Installation](#-installation)
- 🚀 [Usage](#-usage)
- 📙 [Documentation](#-documentation)
- 👷‍♂️ [Contributing](#-contributing)  
- 🐛 [Known Bugs](https://github.com/CodingPeaks/h2o/issues)

## 📷 About Project
[![Just A Simple Monitoring Interface for Nagios](https://raw.githubusercontent.com/CodingPeaks/jasmin/master/img/screenshot.png)](https://github.com/CodingPeaks/jasmin)

 ## 🙌 Features
* [✔️] Super easy to use
* [✔️] Monitor all devices simultaneously
* [✔️] GPL-3.0 License
* [✔️] Only need Nagios, PHP and Apache

## 🔨 Installation

### Requirements
* PHP >= 7
* Nagios (on the server you want to monitor)
* Web Server (Apache2, Nginx, Tomcat ecc..)

### If you want to use Jasmin to monitor other nagios instances:

1. Copy the content of this repository except for nagios.php to a directory on the server you want to monitor and make it accessible via HTTP (eg. on Apache, /var/www/html)
2. Edit config.json and add the servers you want to monitor
3. Access the web interface with your browser to verify the installation

### If you want to make a nagios instance monitorable with Jasmin: 

1. Copy nagios.php to a directory on the server you want to monitor and make it accessible via HTTP (eg. on Apache, /var/www/html)
2. Edit nagios.php and set the correct path for the status.dat file
3. Access nagios.php with your browser to verify the installation

### If you want to make a nagios instance monitorable with Jasmin AND to use Jasmin to monitor other nagios instances: 

1. Copy the content of this repository to a directory on the server you want to monitor and make it accessible via HTTP (eg. on Apache, /var/www/html)
2. Edit config.json and add the servers you want to monitor
3. Edit nagios.php and set the correct path for the status.dat file
4. Access the web interface with your browser to verify the installation
5. Access nagios.php with your browser to verify the installation


## 🚀 Usage
TODO

## 📙 Documentation
TODO

## 👷‍♂️ Contributing 
<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/anAverageSlavGuy"><img src="https://avatars.githubusercontent.com/u/55255040?v=4" width="100px" alt=""/><br /><sub><b>Yevgeniy Shavlay</b></sub></a><br /><a href="https://github.com/anAverageSlavGuy" title="Code">💻</a> <a href="https://github.com/anAverageSlavGuy" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/CodingPeaks"><img src="https://avatars.githubusercontent.com/u/39136442?v=4" width="100px" alt=""/><br /><sub><b>Marco Nardone</b></sub></a><br /><a href="https://github.com/CodingPeaks" title="Code">💻</a> <a href="https://github.com/CodingPeaks" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
