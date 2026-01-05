#!/usr/bin/env bash
set -euo pipefail

sudo apt update && sudo apt install -y pandoc texlive texlive-xetex texlive-luatex fonts-noto-cjk fonts-naver-d2coding

# 1) 합칠 md 생성
printf "%s\n" "# Source Code" > code.md
printf "%s\n" "## Structure" >> code.md
printf "%s\n" '```' >> code.md
tree dist >> code.md
printf "%s\n" '```' >> code.md

# 2) dist 폴더 내 텍스트 파일만 합치기
while IFS= read -r f; do
  if file -b --mime "$f" | grep -q 'text/'; then
    lang="${f##*.}"
    printf "\n## %s\n\n" "$f" >> code.md
    printf "%s\n" "\`\`\`$lang" >> code.md
    cat "$f" >> code.md
    printf "%s\n" "\`\`\`" >> code.md
  fi
done < <(find dist -type f | sort)

# 3) PDF 출력
pandoc code.md -o code.pdf \
  --highlight-style=haddock \
  --pdf-engine=xelatex \
  -H header.tex \
  -V linestretch=1.08 \
  -V mainfont="Noto Sans CJK KR" \
  -V monofont="D2Coding" \
  -V geometry:margin=1.2cm

