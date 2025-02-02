const options = {
    Watch:'./elevate/templates', // Folder to watch for changes
    FileTypes:['html', 'jsx', 'tsx', 'astro'], //Valid filetypes to watch for changes
    Output:'./', //Where to put the compiled CSS
    Extend:[], //CSS files to include as well
    ClassRegex: [
        /class\s*=\s*"([^"]+)"/g, // Matches class="..."
    ]
}

export const config = options




