# Muzzleloader Range Log

## Description

Muzzleloader shooters have unique requirements for documenting their shooting sessions at the range. They need to document all the variables in the loading of each shot as well as the result. A cartridge gun shooter just needs to document the cartridge they are using. This project is an attempt to provide a range log with the expanded reporting requirements of the muzzleloader shooter. The MVP will just be a text based log running from a server. The intention is that this product will be primarily used on mobile devices. Then we will add local storage and eventually full PWA functionality. At some point in the future, we may have graphical plotting of shots on a target, but that is way down the line.

## Table of Contents (Optional)

If your README is long, add a table of contents to make it easy for users to find what they need.

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

This project will run from Heroku at https://muzzleloader-range-log.herokuapp.com and will not initially require any end-user installation. The end-user may, however, install the application locally by clicking on the download/install icon at the top right of the browser. This will install a service worker for the application that will handle offline caching of application content.

When installing this application for development work or to run in production, a JWT_SECRET environment variable must be set.

## Usage

Execute the application from the web at https://muzzleloader-range-log.herokuapp.com. The instructions for use may be found here: https://www.markelliottva.com/2022/09/muzzleloader-range-log/.

## Credits

Mark Elliott https://github.com/melliott7264

## License

Copyright (c) 2022 Mark Elliott

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
