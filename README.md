# Restaurant Management Read-me

**Name:** Sami Bhatti

**Files included:**
```markdown
.
|- public
        |- add.png
        |- orderform.html
        |- orderform.js
        |- remove.png
        |- style.css
|- views
        |- pages
                |- homePage.pug
                |- login.pug
                |- order.pug
                |- orderform.pug
                |- otherProfile.pug
                |- ownProfile.pug
                |- register.pug
                |- users.pug
        |- partials
                |- logged-in.pug
                |- not-logged-in.pug
|- database-initializer.js
|- package.json
|- server.js
```

**To Run:**
```jsx
npm install //Install all dependencies outlined in package.json
node database-initializer.js // initializes the database data
node server.js // Runs the server
```

**To Test:**

Navigate to http://localhost:3000
