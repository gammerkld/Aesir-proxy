# Æsir Proxy
Proxy being developed by Matt, Matthew, WWRYanni, and BOBO

Our server: https://discord.gg/uhxG4U6AxM

## Tomodachi Collection (EmulatorJS) setup

If you exported a zip from the EmulatorJS code generator (for example `OUT-BIOSGBA.zip`), wire it up like this:

1. Unzip the file.
2. Copy the extracted output into `games/tomodachi/` in this repo.
3. Commit and push those game files so GitHub Pages can serve them.
4. Keep this launch button in `index.html`:
   ```html
   <a href="#" id="tomodachi-button" data-game-url="games/tomodachi/index.html">Tomodachi Collection</a>
   ```
5. Open the site and click **Tomodachi Collection**.
   - The button highlights.
   - The homepage hides.
   - The embedded emulator loads from `games/tomodachi/index.html`.

If your generated folder has a different entry file name, update `data-game-url` to match it.

<img width="300" height="300" alt="asier" src="https://github.com/user-attachments/assets/3bfc41d6-94e4-4492-8949-89566bf96e78" />
