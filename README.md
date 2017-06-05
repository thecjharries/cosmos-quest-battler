# `cosmos-quest-battler`

This was originally supposed to be a couple of quick terminal scripts to test a theory. It was an interesting exercise, and I've learned that I need to start planning better.

I finally got around to doing some browser test. I tend to forget how bogged down browsers get. I crashed twice with three searchs. I might have to rethink the whole "permute four billion entries in memory" bit.

## Installation

```bash
npm install
```
I've been working recently to get away from global installations and move to local installations. I'm mostly certain everything you need is there. To prevent errors, add the local `.bin` to your `PATH`.

* [Windows](https://superuser.com/questions/284342/what-are-path-and-other-environment-variables-and-how-can-i-set-or-use-them): `.\node_modules\.bin` was what finally worked for me.
* Bash: `export PATH=$PATH;node_modules/.bin`

## Tests

I deserve all the negative things you're thinking. They're coming.

## Angular

As I was putting the finishing touches on some of the brute force logic, I decided this needed a frontend. It was certainly a learning experience. I discovered it's mostly better to just start fresh with `@angular/cli` instead of trying to to integrate it into your workflow. At the same time, Angular has changed an incredible amount and I've got a ton of catching up to do.
