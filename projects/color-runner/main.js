// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    paths: {
        "app": 'out',
        "Phaser": "libs/phaser"
    },
    map : {
        "*": {
            "phaser-ce": "Phaser"
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(["require", "exports", "app/init"]);