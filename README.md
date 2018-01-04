# kickstart

Kick start a project by generating code according to boilerplates.

It's a much simpler alternative to [Yeoman](http://yeoman.io/).


## Install

```
yarn global add kickstart-cli
```


## Usage

```
ks -b boilerplate-project/ -c config.yml -o output-directory/
```

A new project will be created at `output-directory/`, using `boilerplate-project/` as boilerplate and `config.yml` as configuration file.

`-o output-directory/` is optional. By default it is '.'.

`-c config.yml` is also optional. The default configuration file `boilerplate-project/kickstart.yml` will be used. If you do specify a configuration file, configuration items in your configuration file will override the default ones.


## Why?

Lots of projects look similar. For example, when I start a new JavaScript projects, I always created the following files: `README.md`, `package.json`, `.gitignore`, `.editorconfig`, `.babelrc`...etc.

I want a command line utility to create those files for me.


## How it works

First of all, create a boilerplate project. The project could be of any type, any programming language.

For strings that cannot be determined ahead of time, define them as `{{ variable }}`.

For example, I can define a boilerplate for JavaScript projects with following directory structure:

```
boilerplate-javascript-project
    - package.json
    - .editorconfig
    - .babelrc
    - README.md
    - .gitignore
    - kickstart.yml
```

A sample `package.json` file:

```json
{
  "name": "{{ name }}",
  "version": "{{ version }}",
  "license": "{{ license }}",
}
```

A sample `kickstart.yml` file:

```yml
name: my-app
version: 0.1.0
license: MIT
```

Run the following command to generate a new project:

```
mkdir my-awesome-project
cd my-awesome-project
ks -b ../boilerplate-javascript-project/
```

The generated project:

```
my-awesome-project
    - package.json
    - .editorconfig
    - .babelrc
    - README.md
    - .gitignore
```

Generated `package.json` file has the following content:

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "license": "MIT",
}
```

You can also provide a configuration file: `config.yml`:

```yml
name: cool-project
```

And specify `-c config.yml` when executing the `ks` command.

In such case the generated `package.json` file is:

```json
{
  "name": "cool-project",
  "version": "0.1.0",
  "license": "MIT",
}
```
