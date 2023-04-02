# Lab4
## Start program
### Basic requirements:
- Python 3.8.8
- [Poetry Virtual Environment](https://python-poetry.org/)
## Installation of this version of Python
You have two different options:

Install python with [pyenv](https://github.com/pyenv/pyenv) ([pyenv-win](https://github.com/pyenv-win/pyenv-win) for Windows):
```
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"; &"./install-pyenv-win.ps1"
```
Or download [Python 3.8.8](https://www.python.org/downloads/release/python-388/) from official website.
## Installation of Poetry
Open Terminal or Powershell and execute command:
```
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```
Command for adding the poetry executable:
```
$Env:Path += ";C:\Users\{your-user}\AppData\Roaming\Python\Scripts"; setx PATH "$Env:Path"
```
Then check your installation:
```
poetry --version
```
Full guide you can find [here](https://www.jetbrains.com/help/pycharm/poetry.html#56e5486).
## Poetry packages installation
Reactivate of Poetry shell:
```
poetry shell
```
And then install:
```
poetry install
```
## Starting program
Open way for your project in cmd and enter first command:
```
startProgram.cmd
```
Then enter next command to get information:
```
getInfo.cmd
```
### Congratulations! You started my project!
#### Author: Sviatoslav Shainoha
