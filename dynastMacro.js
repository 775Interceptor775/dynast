(function() {
    const Hacks = {
        AutoE: {enabled: false, keyCode : 81, code: "KeyQ"}
    }

    const gameCanvas = document.getElementById("unity-canvas")
    var gl = gameCanvas.getContext("webgl2")

    var calledAmount = 0;
    var whileCalledAmount = 0;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://fonts.googleapis.com/css2?family=Arvo:wght@700&display=swap';
    document.getElementsByTagName('head')[0].appendChild(link);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function keyDown(keyCode){
        var event = document.createEvent('Events');
        event.initEvent('keydown', true, true);
        event.keyCode = keyCode;
        window.dispatchEvent(event);
    }

    function keyUp(keyCode){
        var event = document.createEvent('Events');
        event.initEvent('keyup', true, true);
        event.keyCode = keyCode;
        window.dispatchEvent(event);
    }

    window.addEventListener("keypress", function(e) {
        if(e.code == Hacks.AutoE.code){
            Hacks.AutoE.enabled = !Hacks.AutoE.enabled
            console.log(Hacks.AutoE.enabled)
        }
    });

    window.Utilities = {
        initUI: () => {
            window.gui = new guify({
                title: 'Dynast Macro',
                theme: {
                    name: 'Client',
                    colors: {
                        panelBackground: 'rgb(0,0,0)',
                        componentBackground: 'rgb(3, 16, 34)',
                        componentForeground: 'rgb(62, 125, 215)',
                        textPrimary: 'rgb(0, 255, 255)',
                        textSecondary: 'rgb(255,255,255)',
                        textHover: 'rgb(43, 16, 159)'
                    },
                    font: {
                        fontFamily: 'Arvo, bold',
                        fontSize: '15px',
                        fontWeight: '1'
                    },
                },
                align: 'right',
                width: 300,
                barMode: "none",
                panelMode: "none",
                opacity: 1,
                root: document.body,
                open: false
            });

            gui.Register({ type: 'folder', label: 'AutoE', open: false });
            gui.Register([
                { type: 'button', label: "Set AutoE Key" , action: data => { Utilities.controls.setKeyBind("AutoE") } },
                { type: 'display', label: 'AutoE Key:', object: Hacks.AutoE, property: 'code'},

            ], { folder: "AutoE"})

        },
        controls: null,
        controller: class {
            setKeyBind(callback) {
                Hacks[callback].keyCode = 'Press any key';
                let click = 0;
                document.addEventListener('keydown', function abc(event) {
                    click++;
                    if (click >= 1) {
                        if (event.code == "Escape") {
                            Hacks[callback].enabled = true;
                            Hacks[callback].keyCode = "NONE";
                            Hacks[callback].code = "NONE";
                        } else {
                            Hacks[callback].enabled = true
                            Hacks[callback].keyCode = event.keyCode;
                            Hacks[callback].code = event.code;
                        };
                        document.removeEventListener('keydown', abc);
                        Utilities.saveSettings();
                    };
                });
            }
        },
        saveSettings: () => {
            for (let hack in Hacks) {
                localStorage.setItem(hack, JSON.stringify(Hacks[hack]));
            };
        },
        loadSettings: () => {
            for (let hack in Hacks) {
                let data = localStorage.getItem(hack);
                if (data) Hacks[hack] = JSON.parse(data);
            };
        },
        LoadHack: () => {
            Utilities.loadSettings();
            Utilities.controls = new Utilities.controller();
            let script = document.createElement('script');
            script.onload = function () {
                Utilities.initUI();
            };
            script.src = 'https://unpkg.com/guify@0.12.0/lib/guify.min.js';
            document.body.appendChild(script);
        },
    }

    async function loop(){
        calledAmount += 1
        if(whileCalledAmount >= 5){
            await sleep(0)
            whileCalledAmount = 0
        }
        while(Hacks.AutoE.enabled && whileCalledAmount <= 5){
            whileCalledAmount += 1
            keyDown(69)
            keyUp(69)
        }
        if(calledAmount <= 100){
            loop();
        }
        if(calledAmount >= 100){
            calledAmount = 0;
            await sleep(0)
            loop();
        }
    }
    loop()
    window.onload = function() {
        Utilities.LoadHack()
    }
})();
