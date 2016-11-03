ObjecDot
====

<a name="install"></a>
## Install

```html
<script type="text/javascript" src="objectdot.js"></script>
```

---

<a name="basic"></a>
## Basic Usage

Manually creating complex deep object structure is tedious, ObjecTree makes it easy for us using "." dot separated path to create object tree given it's value.

**Figure 1. Initialization**

```js
var object = ObjecDot([object...]);
```

>**NOTE** Parameter in initialization is an optional existing object.

**Figure 2. Creating a path and Getting it's value**

```js
var structure = object
.set('query.bool.term.user', 'Charles')
.set('filter', [{ user : 'charles' }])
.add('filter', { user : 'richard' });

// get the specific path
var user = structure.get('query.bool.term.user');
// get the entire object
var structure = structure.get();
```

***OUTPUT***

```js
{
    "query" : {
        "bool" : {
            "term" : {
                "user" : "Charles"
            }
        }
    },
    "filter" : [
        {
            "user" : "charles"
        },
        {
            "user" : "richard"
        }
    ]
}
```