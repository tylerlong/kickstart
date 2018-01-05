# kickstart

Kick start a project by generating code according to boilerplate.

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

I wanted a command line utility to create those files for me. I checked the popular [Yeoman](http://yeoman.io/) project but failed to comprehend its work flow. I decided to create a new tool which is both flexible and straightforward.


## Q & A

- Is kickcstart for JavaScript projects only?
    - Nope, it is for all kinds of projects no matter what programming languages they use.
- Does kickstart support boilerlate projects with nested directory structure?
    - Yes. Boilerplate project can have deeply nested directory strucutre.
- What's the main differences between Yeoman and kickstart?
    - A boilerplate project for Yeoman (they call it a generator project) must be a Node.js module. Kickstart doesn't have this requirement.
        - Yeoman could generate projects for all kinds of languages but the boilerplate/generator project must be Node based. So developers who don't write JavaScript might have difficulty authoring a boilerplate/generator project.
    - Kickstart is much simpler than Yeoman. In the other hand, it doesn't have as many features as Yeoman. Kickstart is pretty new and it is still under development.


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

Please note that, a boilerplate project must have a `kickstart.yml` file in its root directory.

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


## Advanced templating

[Nunjucks](https://github.com/mozilla/nunjucks) is the underlying templating engine.

You can use some of its adanvaced features.

`config.yml`:

```yml
food:
  ketchup: 5 tbsp
  mustard: 1 tbsp
  pickle: 0 tbsp
```

Template:

```
{% for ingredient, amount in food %}
  Use {{ amount }} of {{ ingredient }}
{% endfor %}
```


## Todo

- detect binary files
- add unit tests
