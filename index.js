const startLength = 16;
let lastLength = 0;
const slider = $('.ui.slider').slider({
    min: 1,
    max: 64,
    start: startLength,
    step: 1,
    onMove: (e) => {
        $('#length').val(e)
        if(lastLength != e)
            newPassword();
        lastLength = e;
    }
})

$('#length').val(startLength)
$('#generatePassword').click(() => newPassword());

$('#copyPassword').click(function(){
    clearTimeout(popupTimer);
    $('#password').select();
    document.execCommand('copy');

    $('#password').blur();

    $(this).popup({
        title: 'Successfully copied to the clipboard!',
        on: 'manual',
        exclusive: true
    }).popup('show');

    delayPopup(this);
});
var popupTimer;
function delayPopup(popup){
    popupTimer = setTimeout(function(){ $(popup).popup('hide')}, 1000);
}

$('#length').on('input', function(e) {
    let value = parseInt(e.target.value);
    if(value > 0)
        slider.slider('set value', value);
})

$('.ui.checkbox').checkbox({
    onChange: () => newPassword()
})

Object.defineProperty(Array.prototype, 'randomIndex', {
    value: function() { return Math.floor(Math.random()*this.length);}
})

Object.defineProperty(Array.prototype, 'random', {
    value: function() { return this[this.randomIndex()];}
})

const newPassword = () => {
    let length = $('.ui.slider').slider('get value');
    let includeLowercase = $('#includeLowercase').checkbox('is checked');
    let includeUppercase = $('#includeUppercase').checkbox('is checked');
    let includeNumbers = $('#includeNumbers').checkbox('is checked');
    let includeSymbols = $('#includeSymbols').checkbox('is checked');

    let password = generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols);
    $('#password').val(password);
}

newPassword();

function generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols)
{
    if(!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols)
        return "";

    const lowercaseLetters = [...'abcdefghijklmnopqrstuvwxyz'];
    const uppercaseLetters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const numbers = [...'0123456789'];
    const symbols = [...'!"#$%&\'()*+,-./'];

    var chars = [
        ...includeLowercase ? lowercaseLetters : [],
        ...includeUppercase ? uppercaseLetters : [],
        ...includeNumbers ? numbers : [],
        ...includeSymbols ? symbols : [],
    ]

    let mustIncludeChars = [];

    if(includeLowercase)
    mustIncludeChars.push(lowercaseLetters.random());

    if(includeUppercase)
    mustIncludeChars.push(uppercaseLetters.random());
    
    if(includeNumbers)
    mustIncludeChars.push(numbers.random());
    
    if(includeSymbols)
    mustIncludeChars.push(symbols.random());

    let password = [];

    for(let i = 0; i< length-mustIncludeChars.length; i++)
        password.push(chars.random());

    mustIncludeChars.map(c => password.splice(password.randomIndex(), 0, c));

    return password.join("");
}

function characters(firstChar, lastChar) {
    return Array.from(Array(lastChar.charCodeAt(0)-firstChar.charCodeAt(0)+1).keys()).map(c => String.fromCharCode(c+firstChar.charCodeAt(0)));
}