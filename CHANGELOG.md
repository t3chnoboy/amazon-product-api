## Version 1.0.0 2017-01-28
- Updated return format so that both promises and callback now have the same structure:

```javascript
{
  'response': <req response>,
  'results': <amazon data>
}
```

```javascript
function(err, results){...}
// Where err is an error message
// results is the new data object described above
```

- Promise has the following format:

```javascript
then(function(results){...})
// Where results is new data object described above
```

- Updated tests to handle API changes
- Updated README.md to reflect API changes
- Updated broken brwoseNodeLookup example

If you're coming from v0.4.3 or before the callback returned two objects,
`results` and `response`.  Now it only returns a single object, `results`
that contains two objects:
```javascript
{
  'response': <req response>,
  'results': <amazon data>
}
```
You'll need to update your code accordingly.

## Version 0.4.3 2017-01-26
- Callback has the following format:

```javascript
function(err, results, response){...}
// Where err is an error message
// results is Items[0].Item from the API call
// response is Items from the API call
```

- Promise has the following format:

```javascript
then(function(results){...})
// Where results is Items[0].Item from the API call
```

