# @copyright 2013
# @author Adu Bhandaru
# Performs various tasks in the project.

all: src
	tools/build.sh

clean:
	rm -f build/*
