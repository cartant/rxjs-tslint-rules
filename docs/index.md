`rxjs-tslint-rules` is small set of TSLint rules to help manage projects that use `rxjs/add/...` imports and to highlight other potential problems.

### Rules

The package includes the following rules:

| Rule | Description | Options |
| --- | --- | --- |
| `rxjs-add` | Enforces the importation of patched observables and operators used in the module. | See below |
| `rxjs-no-add` | Disallows the importation of patched observables and operators. | None |
| `rxjs-no-do` | I do without `do` operators. [Do you not?](https://youtu.be/spG-Yj0zEyc) | None |
| `rxjs-no-patched` | Disallows the calling of patched methods. Operators must be imported and called explicitly - not via the `Observable` prototype. | None |
| `rxjs-no-subject-unsubscribe` | Disallows the calling of `unsubscribe` directly upon `Subject` instances. For an explanation of why this can be a problem, see [this](https://stackoverflow.com/a/45112125/6680611) Stack Overflow answer. | None |
| `rxjs-no-unused-add` | Disallows the importation of patched observables or operators that are not used in the module. | None |
| `rxjs-no-wholesale` | Disallows the wholesale importation of `rxjs` or `rxjs/Rx`. | None |

### Options

The `rxjs-add` rule takes an optional object with the property `file`. This is the path of the module - relative to the `tsconfig.json` - that imports the patched observables and operators.

For example:

```json
"rules": {
  "rxjs-add": {
    "options": [{
      "allowElsewhere": false,
      "allowUnused": false,
      "file": "./source/rxjs-imports.ts"
    }],
    "severity": "error"
  }
}
```

Specifying the `file` option allows all of the patched observables and operators to be kept in a central location. Said module should be imported before other modules that use patched observables and operators. The importation of said module is not enforced; the rule only ensures that it imports observables and operators that are used in other modules.

If `file` is specified, the `allowElsewhere` and `allowUnused` options can be used to configure whether or not patched imports are allowed in other files and whether or not unused patched imports are allowed. Both `allowElsewhere` and `allowUnused` default to `false`.

Note that there is no `file` option for the `rxjs-no-unused-add` rule, so that rule should not be used in conjunction with the `rxjs-add` rule - if the `file` option is specified for the latter. Use the `rxjs-add` rule's `allowUnused` option instead.

If the `file` option is not specified, patched observables and operators must be imported in the modules in which they are used.

<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-103034213-2', 'auto');
    ga('send', 'pageview');
</script>
