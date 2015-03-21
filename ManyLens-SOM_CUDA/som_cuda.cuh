#ifndef __SOM_CUDA__
#define __SOM_CUDA__

#pragma once
#ifdef __INTELLISENSE__
void __syncthreads();

#endif

#include "cuda_runtime.h"
#include "device_launch_parameters.h"
#include <cuda.h>
#include "cublas.h"
#include <random>
#include <ctime>
#include <cmath>
#include <cfloat>
#include <fstream>
#include <iostream>
#include <string>

#define DIMENSION 1024
#define CHKSIZE 4     //neuron number must be evenly divisible by CHKSIZE

#ifdef __cplusplus 
extern "C"

{

#endif

#ifdef SOM_CUDA_EXPORTS

#define SOM_CUDA_API __declspec(dllexport) 

#else

#define SOM_CUDA_API __declspec(dllimport)

#endif

	//Initialize CUDA runtime
	SOM_CUDA_API int InitializeCUDA(void);

	//Do cleanup when close the program
	SOM_CUDA_API int CleanUp(void);

	SOM_CUDA_API float* SOMwithRandomMapping(const float* h_gaussin,
		const float* h_inputSet,
		const float* h_initial_weight,
		const unsigned int input_set_size,
		const unsigned int dimension,
		const unsigned int height,
		const unsigned int width,
		const unsigned int batch_size,
		const int epochNum,
		const float lambda,
		const float iterNum);

	SOM_CUDA_API unsigned int* SOMClassificationwithRandomMapping(const float* h_gaussin,
		const float* h_inputSet,
		const float* h_classifier_weight,
		const unsigned int input_set_size,
		const unsigned int dimension,
		const unsigned int height,
		const unsigned int width,
		const unsigned int batch_size);

	SOM_CUDA_API float* SOMRefinewithRandomMapping(const float* h_gaussin,
		const float* h_inputSet,
		const float* h_BID,
		const float* h_initial_weight,
		const unsigned int input_set_size,
		const unsigned int dimension,
		const unsigned int height,
		const unsigned int width,
		const unsigned int batch_size);

	SOM_CUDA_API unsigned int* FindBID(const float* h_gaussin,
															float* input_vector, unsigned int input_vector_size, unsigned int input_dimension,
															float* weights, unsigned int weights_size);
	

	SOM_CUDA_API void somFree(float* pointer);

#ifdef __cplusplus

}

#endif

#endif