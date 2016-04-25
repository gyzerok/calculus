# Calculus

Here is a world changing service for simple math expressions evaluation.

## Try it!

You can easily make some calculations in the [web version](http://calculus-app.herokuapp.com/)

## Additional thoughts

Since pure functional style algorithms implementation is always hard I done this in some mix of procedural and functional approach.

All the `Calculator` API are pure functions for better testability while inside they are done in imperative manner. The good idea would be to try to reimplement this stuff in Elm. Why not JavaScript? I guess this algorithm functional implementation would use pattern matching hardly. While you can achieve the same stuff pattern matching is doing with simple `if` statements, code would become as unreadable as in imperative version.