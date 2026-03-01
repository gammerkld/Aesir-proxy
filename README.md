# Æsir Proxy
Proxy being developed by Matt, Matthew, WWRYanni, and BOBO

Our server: https://discord.gg/uhxG4U6AxM

## Tomodachi Collection (EmulatorJS) setup

If you exported a zip from the EmulatorJS code generator (for example `OUT-BIOSGBA.zip`), wire it up like this:

1. Unzip the file.
2. Copy the extracted output into `games/tomodachi/` in this repo.
3. Commit and push those game files so GitHub Pages can serve them.
4. The homepage launch link should point to `adko.html`:
   ```html
   <a href="adko.html">Tomodachi Collection</a>
   ```
5. `adko.html` embeds the emulator at `games/tomodachi/index.html`.
6. To return home, click the logo in the top-left corner.

If your generated folder has a different entry file name, update the iframe `src` in `adko.html`.

<img width="300" height="300" alt="asier" src="https://github.com/user-attachments/assets/3bfc41d6-94e4-4492-8949-89566bf96e78" />
