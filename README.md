# MyGo showcase

Apps built with [MyGo](https://github.com/egoist/mygo), shown at
[mygo.run/showcase](https://mygo.run/showcase). The page reads
[`showcase.yaml`](showcase.yaml) from this repository when it opens, so a
merged entry shows up within minutes, without a new build of the website.

## Add your app

Open a pull request that adds an entry to the end of `showcase.yaml`:

```yaml
- name: My App
  description: >-
    What it does, in a sentence or two, in English.
  url: https://github.com/you/my-app
  author: you
  mode: native
  image: images/my-app.jpg
```

- `name`: the app's name.
- `description`: what it does, in a sentence or two.
- `url`: where to get it or read about it, such as its repository.
- `author`: optional, your name or GitHub login.
- `mode`: optional, `native` when its windows draw native UI (package `ui`),
  `web` when they show a web frontend in the system webview.
- `image`: optional, a screenshot in [`images/`](images), about 1600×1000
  and under 300 KB.

`bun scripts/check.ts` checks the file, as CI does on every pull request.
Editors with the YAML language server complete and check the fields from
[`schema.json`](schema.json).
