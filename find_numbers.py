import os
import re

dir_path = r"C:\Users\loq\.gemini\antigravity\scratch\hotel-advantage-inn"
patterns = [
    re.compile(r"wa\.me/\d+"),
    re.compile(r"tel:[\d\-\+]+"),
    re.compile(r"\b\d{10}\b"),
    re.compile(r"\d{5}\s*\d{5}"),
    re.compile(r"\+91")
]

for root, dirs, files in os.walk(dir_path):
    # Skip images or binary assets
    for file in files:
        if file.endswith(('.html', '.js', '.css', '.txt', '.json')):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    for idx, line in enumerate(lines):
                        for p in patterns:
                            if p.search(line):
                                print(f"{file}:{idx+1}: {line.strip()}")
                                break
            except Exception as e:
                pass
