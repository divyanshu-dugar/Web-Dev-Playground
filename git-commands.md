# 🔧 Git & GitHub Setup

<details>
<summary>🚀 Initial Setup</summary>
<br/>
  
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/divyanshu-dugar/repo-name.git
git push -u origin main  # future pushes can use just: git push
````

</details>

<details>
<summary>🌿 Branching Commands</summary>
<br/>
  
```bash
git branch                    # view branches
git branch -m main            # rename current branch to main
git checkout main             # switch to main branch
# OR
git switch main
```

</details>

<details>
<summary>👤 Git Global Configuration</summary>
<br/>
  
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

</details>
<br/>

<details>
<summary>Archive</summary>

Nice — I’ll give you a clear, copy-and-pasteable step-by-step to connect the Git on your Mac to GitHub using **SSH** (recommended) + short alternatives (HTTPS). Follow each step in Terminal.

# 1) Configure Git identity (one-time)

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

# 2) Check for an existing SSH key

```bash
ls -al ~/.ssh
```

If you see files like `id_ed25519` & `id_ed25519.pub` (or `id_rsa*`) you already have keys. If not, create one next.

# 3) Create an SSH key (recommended: ed25519)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

* Press Enter to accept default file location (`/Users/you/.ssh/id_ed25519`).
* Choose a passphrase (recommended) or press Enter for none.

# 4) Start the SSH agent and add your key

```bash
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

> On older macOS versions use `ssh-add -K ~/.ssh/id_ed25519`. The `--apple-use-keychain` keeps the passphrase in macOS Keychain.

# 5) Copy your public key to clipboard

```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

Now your public key is copied.

# 6) Add the SSH key to your GitHub account

1. Open [https://github.com](https://github.com) and log in.
2. Click your avatar → **Settings** → **SSH and GPG keys** → **New SSH key**.
3. Paste the key (from clipboard) into the “Key” box, give it a Title like `MacBook Pro` and click **Add SSH key**.
4. If prompted, confirm with your GitHub password / 2FA.

# 7) Test the SSH connection

```bash
ssh -T git@github.com
```

* Successful message: `Hi <username>! You've successfully authenticated...`
* If you see `Are you sure you want to continue connecting (yes/no)?` type `yes`.

# 8) Ensure your repo uses the SSH remote URL

In your project folder:

```bash
git remote -v
```

If the remote is `https://github.com/...` you can switch to SSH:

```bash
git remote set-url origin git@github.com:username/repo.git
```

Replace `username/repo.git` with your repo path. Then try:

```bash
git push
```

# Troubleshooting (common fixes)

* **Permission denied (publickey)**

  * Make sure the key you uploaded matches `~/.ssh/id_ed25519.pub`.
  * Confirm `ssh-agent` has your key: `ssh-add -l`. If empty, run the `ssh-add` command again.
* **ssh asks for passphrase each time**

  * Ensure you used `--apple-use-keychain` or the `-K` flag when adding the key.
* **Wrong key being used (multiple keys)**

  * Create or edit `~/.ssh/config`:

    ```
    Host github.com
      HostName github.com
      User git
      IdentityFile ~/.ssh/id_ed25519
      UseKeychain yes
    ```
* **File permissions problems**

  ```bash
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/id_ed25519
  chmod 644 ~/.ssh/id_ed25519.pub
  ```

# Alternative: Use HTTPS with macOS keychain (no SSH)

If you prefer HTTPS (you’ll enter username/password or use a PAT — Personal Access Token):

1. Set remote to HTTPS:

   ```bash
   git remote set-url origin https://github.com/username/repo.git
   ```
2. Make sure credential helper is enabled (macOS):

   ```bash
   git config --global credential.helper osxkeychain
   ```
3. On `git push` you’ll be prompted for username and password — use your GitHub username and a **Personal Access Token (PAT)** if GitHub asks for a token instead of password.

# Quick checklist you can run now

```bash
git config --global user.name
git config --global user.email
ls -al ~/.ssh
ssh-add -l
ssh -T git@github.com
git remote -v
```

---

If you want, tell me:

* whether you prefer **SSH** or **HTTPS**, and
* paste the output of `git remote -v` and `ssh -T git@github.com` (if you ran it) — I’ll diagnose any error you get and give the exact fix.

</details>
