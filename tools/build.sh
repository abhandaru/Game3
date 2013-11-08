#!/bin/sh

# @copyright 2013
# @author Adu Bhandaru
# Build library from source.

echo ">> Building ..."

IN_DIR="src"
OUT_DIR="build"
FILES=("Game3.js" "Class.js" "Model.js" "Light.js" "Event.js" "Events.js" "Game.js")
MINIFIER="uglifyjs"
OUTPUT="game3.min.js"

# build the command
command="cat "
for file in "${FILES[@]}"
do
  command="${command}${IN_DIR}/${file} "
  echo $file
done

# create build directory (if needed)
mkdir -p "${OUT_DIR}"

# minifier command
command="${command}| ${MINIFIER} -o ${OUT_DIR}/${OUTPUT}"

# run command
echo ">> Running minifier ..."
eval "${command}"

echo ">> Done!"
