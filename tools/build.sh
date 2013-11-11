#!/bin/sh

# @copyright 2013
# @author Adu Bhandaru
# Build library from source.

echo ">> Building ..."

IN_DIR="src"
FILES=(
  "Game3.js"
  "Class.js"
  "Collision.js"
  "Collisions.js"
  "Model.js"
  "Light.js"
  "Event.js"
  "Events.js"
  "Game.js")
OUT_DIR="build"
OUTPUT="game3.min.js"
MINIFIER="uglifyjs"

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
