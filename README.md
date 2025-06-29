## Instructions

To initialize on your individual IDE insert the following commands in your terminal:

```
git clone https://github.com/isaiaspavon/swe-project.git
```

```
git init
```

```
git remote add origin git@github.com:isaiaspavon/swe-project.git
```

```
cd frontend
```

```
npm install
```

## GitHub workflow

To begin coding and make changes onto the project:

### 1. **ALWAYS Pull the latest changes first before you start working from the main branch**

This ensures that your local code is up to date with others' work:

 ```
 git pull origin main
 ```

### 2. **Stage all updated files for commit**

Prepares every change in your local directory to be committed:

```
git add .
```

### 3. **Commit your changes with a clear message**

This describes the changes you made in this commit:

```
git commit -m "<your-commit-message-here>"
```

Example:

```
git commit -m "Add login modal and fix navbar responsiveness"
```

### 4. **Push your commit to GitHub**

This sends your local commit to the main branch:

```
git push origin main
```