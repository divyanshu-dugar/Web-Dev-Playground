# 🧪 Common Issues & Fixes

<details>
<summary>❗ NVM Not Found</summary>
<br/>
  
```bash
# If `nvm` is not recognized
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
````

</details>

<details>
<summary>🧹 DataBase / Server Troubleshooting</summary>
<br/>
  
* Bad data gets added to mongodb → remove it manually from MongoDB Atlas
* Data might not exist → use `?` optional chaining (`data?.field`)
* Data might not be pushed to hosting server
* Server not watching for changes → restart server

</details>
<br/>
