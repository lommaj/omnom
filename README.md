# This is omnom, a Omniture templating jQuery plugin

Requires:

Omnitures s_code.js

Some of the things this does right now:
+ dynamically creates omniture tags for custom links, exit links and for s.prop reporting using a query string (?lid)
+ adds target="_blank" to exit links, adds an 'external' class
+ reports exit links and custom links through the s.tl() function
+ creates query strings for links to utilize s.prop reporting
+ allows templating of page sections for modular tagging

Will soon be more customizable.  Just started this project and its my first real github experience.

This code was created to work with a moustache.js template, I would like to make it more user friendly and feature rich!


Usage:
```javascript
$.omnom();
```

With Options - Set as many selectors to append to tag:
```javascript
$.omnom({
    querystring: 'q',
    sectionTemplate: [
        { selector: ".carousel", reportingValue: "cs" },
        { selector:".footerNav", reportingValue: "fn"}
    ]
});
```

Enjoy!

John Lomma
