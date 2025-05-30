Getting started with Debugging

1. Using the `launch.json` that we have set before, it stop the code execution in `Programs/python.c` file. Here we check the OS we are using a macro `#ifdef MS_WINDOWS` this macro will only be defined in windows system and will have it's own main entry point. For this article we will be following the else statement as I am not using windows. We see we will be going inside the `Py_BytesMain` function let's follow with `step into` option.
2.  Here we see we will be putting the arguments that we have passed and their informations into a struct called as `_PyArgv`. As we saw from above if we have been using windows system the command line arguments would have been in unicode format rather than in the bytes format. That's why we have two entry point and also we can see the difference in `bytes_argv` and `wchar_argv` key of struct `_PyArgv`. Then from both point we will be calling the `pymain_main` function.
3. Now we will be starting the initialization process of the python. In coming code you will see a patter to check status of the response with something like `PyStatus status = some_function(arguments);` here the`PyStatus` is a struct which will hold all the possible response that we will get from the function we have called. Finally we will check if the status match some cases like for exception using this function`_PyStatus_EXCEPTION`
4. We will now go deep into the initialization process, so let's step into the `pymain_init` function.
5. Firstly we will check for the runtime status with `_PyRuntime_Initialize`. As python supports multi threading and the function can be provoked from any thread. We try to make it as singleton and will not let anyone initialize the runtime more than once.
6. For our case as we don't have any already running runtime, we will proceed into `_PyRuntimeState_Init` function. The runtime we have passed here is a struct and have default value.
7. Before we continue we need to know little about TSS(Thread specific storage) and GIL state and Thread Specific Trash
8. These steps involve us diving deep into memory and memory allocation so we will continue in next part.


