const options = {
    Watch:'./elevate/templates', // Folder to watch for changes
    FileTypes:['html', 'jsx', 'tsx', 'astro'], //Valid filetypes to watch for changes
    Output:'./', //Where to put the compiled CSS
    Extend:[], //CSS files to include as well
    ClassRegex: [
        /\bclass\s*=\s*"([^"]*)"/g,                // class="..."
        /\bclass\s*=\s*'([^']*)'/g,                // class='...'
        /\bclassName\s*=\s*"([^"]*)"/g,            // className="..."
        /\bclassName\s*=\s*'([^']*)'/g,            // className='...'
        /\bclassName\s*=\s*{\s*`([\s\S]*?)`\s*}/g  // className={`...`}
      ],
    SafeList:[]
}

export const config = options




