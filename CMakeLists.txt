cmake_minimum_required(VERSION 3.11)
project(libsamplerate)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

include(FetchContent)

set(BUILD_TESTING OFF CACHE BOOL "Disable tests for libsamplerate")
FetchContent_Declare(
  libsamplerate
  GIT_REPOSITORY https://github.com/libsndfile/libsamplerate
  GIT_TAG 0.2.2
)

FetchContent_MakeAvailable(libsamplerate)

# Build a shared library named after the project from the files in `src/`
file(GLOB SOURCE_FILES "src/*.cc" "src/*.h")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

# Gives our library file a .node extension without any "lib" prefix
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# Include N-API wrappers
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC} "${CMAKE_SOURCE_DIR}/node_modules/node-addon-api")

# Essential library files to link to a node addon
# You should add this line in every CMake.js based project
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} samplerate)
add_dependencies(libsamplerate samplerate)
