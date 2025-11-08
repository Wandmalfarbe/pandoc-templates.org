<img src="icon.png" align="right" height="60"/>

# Pandoc Templates

Source code for https://pandoc-templates.org

##  Build

Configure environment variables in `~/.zprofile` (when using Zsh):

``` sh
export GH_ACCESS_TOKEN="..."
```

Install dependencies and build:

```
npm ci
bash ./build.sh
```

## Notes

Use `jq` to sort all template entries by title.

``` .shell
jq '. |= sort_by(.title|ascii_upcase)' templates_backup.json > sorted.json
```
