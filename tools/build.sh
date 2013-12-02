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
OUTPUT="game3"
OUTPUT_HEADER="// Game3 - http://abhandaru.github.io/Game3/\n// (c)2013 Adu Bhandaru\n"
MINIFIER="uglifyjs --mangle"

# build the command
command="cat "
for file in "${FILES[@]}"
do
  command="${command}${IN_DIR}/${file} "
  echo $file
done

# create build directory (if needed)
mkdir -p "${OUT_DIR}"

# make full
full_file="${OUT_DIR}/${OUTPUT}.js"
full_command="${command}>> ${full_file}"
echo ">> Concatenating sources ..."
echo "${OUTPUT_HEADER}" > "${full_file}"
eval "${full_command}"

# run command
min_file="${OUT_DIR}/${OUTPUT}.min.js"
min_command="cat ${full_file} | ${MINIFIER} -o ${min_file}"
echo ">> Minifying source ..."
eval "${min_command}"

# finished!
echo ">> Done!"
