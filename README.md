# kickstart

Kick start a project by generating code according to template. Defined a template project and reuse it again and again to kick start new projects. All kinds of projects are supported no matter what programming languages they use.

It's a much simpler alternative to [Yeoman](http://yeoman.io/).


## Install

```
yarn global add kickstart-cli
```


## Usage

```
ks -k kickstart-project -o output-directory
```

A new project will be created at `output-directory`, using `kickstart-project` as template.

`-o output-directory` is optional. By default it is `.`, a.k.a. the current directory.


## Features

- Support projects in all programming languages.
- Support any project to be used as template, even they are not created for scaffolding purpose.
- Support templating, thanks to [nunjucks](https://mozilla.github.io/nunjucks/templating.html).


## Why?

Lots of projects look similar. For example, when I start a new JavaScript projects, I always created the following files: `README.md`, `package.json`, `.gitignore`, `.editorconfig`, `.babelrc`...etc.

I wanted a command line utility to create those files for me. I checked the popular [Yeoman](http://yeoman.io/) project but failed to comprehend its authoring workflow. I decided to create a new tool which is both flexible and straightforward.


## Q & A

- Is kickstart for JavaScript projects only?
    - Nope, it is for all kinds of projects no matter what programming languages they use.
- Does kickstart support template projects with nested directory structure?
    - Yes. Template project can have deeply nested directory strucutre.
- What's the main differences between Yeoman and kickstart?
    - A template project for Yeoman (they call it a generator project) must be a Node.js module. Kickstart doesn't have this requirement.
        - Yeoman could generate projects for all kinds of languages but the template/generator project must be Node based. So developers who don't write JavaScript might have difficulty authoring a template/generator project.
    - Kickstart is much simpler than Yeoman. On the other hand, it doesn't have as many features as Yeoman. Kickstart is pretty new and it is still under development.
- Why is kickstart better than `cp -r source-project target-directory` ?
    - kickstart won't copy `.git/`
    - kickstart won't copy files/directories specified in `.gitignore`
    - kickstart supports configuration and templating.


## How it works

First of all, ask yourself: do I or my users create similar projects again and again? If the answer is no, you probably don't need kickstart and you can stop reading on.

If the answer is yes, create a template project for those similar projects to abstract the things that they have in common. For strings that each project might have a different value, define them as `{{ variable }}`.

For example, I can define a template for JavaScript projects with the following directory structure:

```
kickstart-javascript
    - README.md
    - package.json
    - .gitignore
    - kickstart.yml
```

Please note that, a template project usually has a `kickstart.yml` file in its root directory. If no `kickstart.yml` file is found, an empty one will be used instead. Thus allows any project to be used as a template project.

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
mkdir my-awesome-project && cd my-awesome-project
ks -k /path/to/kickstart-javascript/
```

The generated project:

```
my-awesome-project
    - README.md
    - package.json
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

You can also edit the `kickstart.yml` file as below before executing the `ks` command:

```yml
name: cool-project
version: 0.2.0
license: MIT
```

In such case the generated `package.json` file is:

```json
{
  "name": "cool-project",
  "version": "0.2.0",
  "license": "MIT",
}
```


## Advanced templating

[Nunjucks](https://github.com/mozilla/nunjucks) is the underlying templating engine.

You can use some of its [adanvaced features](https://mozilla.github.io/nunjucks/templating.html). Sample:

`kickstart.yml`:

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


### Comments

You can write comments as `{# comments #}` which will be omitted when generating code.


## Todo

- Each template project must be a runnable project itself
- Toml + regex as config file
    - Just use string match, no regex
    - Then how to support `if`, `for`...etc?
        - Can we give up these adavanced templating features?
            - Then no more `nunjucks`
