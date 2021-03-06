/* 
 * Contains functions for processing input speech from google.
 * Performs automatic corrections to prepare text for easy parsing to struct commands
*/

// export function correct_words
export function clean(input_speech: string, spelling: boolean) {
    input_speech = input_speech.toLowerCase();
    input_speech = spellOutArithmeticOperator(input_speech);
    input_speech = fix_common_errors(input_speech);
    input_speech = correct_variables(input_speech);
    input_speech = word_2_num(input_speech);
    input_speech = find_symbol(input_speech);

    if (spelling) input_speech = spellingFunction(input_speech);
    return input_speech;
}

/* Perform basic cleaning for common errors */
function fix_common_errors(text: string) {
    text = text.replace(/equals/g, 'equal');
    text = text.replace('eko', 'equal');
    text = text.replace('creates', 'create');
    text = text.replace('and declare', 'end declare');
    text = text.replace('and function', 'end function');
    text = text.replace('and string', 'end string');
    text = text.replace('begin is', 'begin if');

    /* line errors */
    text = text.replace('line v', 'line 5');
    return text;
}

function spellOutArithmeticOperator(text: string) {
    text = text.replace(/\+/g, "plus");
    text = text.replace(/-/g, "minus");
    text = text.replace(/\*/g, "multiply");
    text = text.replace(/\//g, "divide");
    text = text.replace(/bit and/g, "bit_and");
    text = text.replace(/bit or/g, "bit_or");
    return text;
}

/* Replace all variables with the short form that will be used in text2struct. If integer is 
part of a string, do not correct it. */
function correct_variables(text: string) {
    if (text.includes("integer") || text.includes("character")) {
        var splitted_text = text.split(" ");
        var string_flag = false;
        for (var i = 0; i < splitted_text.length; i++) {
            if (splitted_text[i] == "string") string_flag = !string_flag;
            else if (!string_flag && splitted_text[i] == "integer") splitted_text[i] = "int";
            else if (!string_flag && splitted_text[i] == "character") splitted_text[i] = "char";
        }
        text = splitted_text.join(" ");
    }
    return text;
}

function find_symbol(text: string) {
    if (text.includes("symbol")) {
        var splitted_text = text.split(" ");
        var symbol_flag = false;
        for(var i = 0; i < splitted_text.length; i++) {
            if (symbol_flag) {
                if (splitted_text[i] == "ampersand") splitted_text[i] = "&";
                else if (splitted_text[i] == "dollar") splitted_text[i] = "$";
                else if (splitted_text[i] == "percent") splitted_text[i] = "%";
                else if (splitted_text[i] == "backslash") splitted_text[i] = "\\";
                else if (splitted_text[i] == "colon") splitted_text[i] = ":";
                else if (splitted_text[i] == "equal") splitted_text[i] = "=";
                else if (splitted_text[i] == "dot" || splitted_text[i] == "point" || splitted_text[i] == "points") splitted_text[i] = ".";
                else if (splitted_text[i] == "star") splitted_text[i] = "*";

                symbol_flag = false;
            }
            if (splitted_text[i] == "symbol")  symbol_flag = true;
        }
        text = splitted_text.join(" ");
        text = text.replace(/symbol /g, "");
    }

    return text;
}

function word_2_num(text: string) {
    text = text.replace('one', '1');
    text = text.replace('two', '2');
    text = text.replace('to', '2');
    text = text.replace('three', '3');
    text = text.replace('tree', '3');
    text = text.replace('four', '4');
    text = text.replace('five', '5');
    text = text.replace('six', '6');
    text = text.replace('seven', '7');
    text = text.replace('eight', '8');
    text = text.replace('nine', '9');
    text = text.replace('ten', '10');

    return text;
}

function spellingFunction(text: string) {

    console.log("soelling")

    text = text.replace("and spell", "end_spell");
    text = text.replace("n spell", "end_spell");
    text = text.replace("end spell", "end_spell");

    var splitted_text = text.split(" ");

    var startPoint = 0;
    var newText = "";

    if (splitted_text.includes("spell")) {
        startPoint = splitted_text.indexOf("spell") + 1;
        newText = "spell";
    }

    /* make sure spell is not last word */
    if (startPoint == splitted_text.length) return text;
    
    var stopSpelling = false;
    for (var i = startPoint; i < splitted_text.length; i++) {

        if (splitted_text[i] == "end_spell") {
            stopSpelling = true;
            newText += " end_spell";
            continue;
        }

        else if (!stopSpelling) {
            if (splitted_text[i].length > 1) {
                if (splitted_text[i] == "zach" || splitted_text[i] == "zack") splitted_text[i] = "z";
                if (splitted_text[i] == "the") splitted_text[i] = "d";
                if (splitted_text[i] == "bee") splitted_text[i] = "b";
                if (splitted_text[i] == "pee") splitted_text[i] = "p";
            }
            newText += " " + splitted_text[i].split("").join(" ");
        }
        else newText += " " + splitted_text[i];
    }

    return newText.replace(/  +/g, ' ').trim();
}
