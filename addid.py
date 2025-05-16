
htmlfile = "./mathvision/index.html"
with open(htmlfile, "r") as file:
    lines = file.readlines()

cnt_idx = 0
new_lines = []
for line in lines:
    if "<!-- RESET IDX -->" in line:
        cnt_idx = 0
    if line.strip().startswith('<td class="idx">') and line.count("<td") == 1:
        new_lines.append(f'<td class="idx">{cnt_idx}</td>\n')
        # new_lines.append(f'<td class="idx"><strong>{cnt_idx}</strong></td>\n') # 
        cnt_idx += 1
        print(new_lines[-1])
    else:
        new_lines.append(line)
    
with open(htmlfile, "w") as file:
    file.writelines(new_lines)