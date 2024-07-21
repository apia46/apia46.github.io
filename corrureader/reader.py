import json
import re
import glob, os
import io

PATH = r"C:\Users\Beeka\Desktop\Things\scraping\provided e3a2"

NOTEABLE_SECTIONS = ["reactions", "reactionPersonalities"]

# thing that reads a single dialogue¿¿
def readDialogue(file:io.BufferedReader, position:int, type:int, page):
    file.seek(position)

    indent = 0
    iter = 0
    
    dialogue = {"context": "",
                "type": type,
                "text": []}
    if type == 3: dialogue["text"] = {}
    section = "" # specifically for chatter

    while True:
        indented = 0 # spaghetti shit
        line = file.readline().decode(encoding="utf-8").rstrip()

        match type:
            case 0|4:
                if re.search(r"(?<!\\)`\)", line): break
            case 1|2|3:
                indented = len(re.findall('{(?![\S]*")', line))
                indent += indented
                indent -= len(re.findall('}([\s_.,`\)]|$)', line))
                if indent == 0: break
                if indent < 2: section = ""
        #print(iter, page, position, type, indent)
        if iter == 0:
            match type:
                case 0: dialogue["context"] = re.search('((?<=env.dialogues.)(?<!["`\'])[ !#-&(-\-\/-\_a-~]*(?= =))|((?<=env.dialogues\[["`\'])[ !#-&(-_a-~]*(?=["`\']] =))', line).group() # so sorry
                case 1|2|3: dialogue["context"] = re.search("[\w]*", line).group()
        else:
            if type == 0 and iter == 1 and line.lstrip() == "RESPOBJ::": type = 4; dialogue["type"] = 4
            if line != "":
                match type:
                    case 0|4: dialogue["text"].append(line)
                    case 1: dialogue["text"].append(line[4:]) # tab is made out of whitespace, remove
                    case 2: dialogue["text"].append(line[5:]) # tabs are made out of \t, remove (thanks corru¿¿¿¿
                    case 3:
                        if indent == 2 and indented != 0:
                            section = re.search('\w+', line).group()
                            if section in NOTEABLE_SECTIONS: dialogue["text"][section] = []
                        else:
                            if section in NOTEABLE_SECTIONS: dialogue["text"][section].append(line[12:])
        iter += 1
    if type == 3 and dialogue["text"] == {}: return None
    return dialogue

def readFile(page):
    file = open(page, "rb")
    content = file.read()
    positions = [] # positions to check
    
    positions.append((content.find(b"mothComment"), 1))
    positions.append((content.find(b"mothChat"), 2))

    pattern = re.compile(b'env\.dialogues(?!\["whatyouput"\])(?!\["\+\+moth"\]\.)(?=(\[["`\'][ -~]*["`\']\])|(.\w*) =)') # normal dialogue
    for match in pattern.finditer(content):
        positions.append((match.start(), 0))

    if page == "js\\combat\\combatActorsJson.js":
        pattern = re.compile(b'(\w+): {(?=\s+name)') # combat chatter
        for match in pattern.finditer(content):
            positions.append((match.start(), 3))
    
    dialogues = []

    for position in positions:
        if position[0] != -1:
            read = readDialogue(file, position[0], position[1], page)
            if read: dialogues.append(read)
    file.close()
    if dialogues == []: return None, None
    title = re.search(b"(?<=<title>)[\w\W]+(?=<\/title>)", content)
    image = re.search(b'(?<="og:image" content=")[\w\W]+(?=">\s+<meta property="twitter:card")', content)

    dialogues.insert(0, {
        "title": title.group().decode() if title else page,
        "image": image.group().decode() if image else "https://corru.observer/img/textures/corruripple.gif"
    })
    return dialogues, page

dir_path = os.path.dirname(os.path.realpath(__file__)) # what does this do https://stackoverflow.com/questions/5137497/find-the-current-directory-and-files-directory
os.chdir(PATH)

output = {}

for file in glob.glob("**/*.html", recursive=True):
    dialogues, page = readFile(file)
    if dialogues: output[page] = dialogues
for file in glob.glob("**/*.js", recursive=True):
    dialogues, page = readFile(file)
    if dialogues: output[page] = dialogues

open(dir_path+"\\dialogue.json", "w").write(json.dumps(output, indent=4))