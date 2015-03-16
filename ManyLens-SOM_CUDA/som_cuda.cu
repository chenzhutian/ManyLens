#include "som_cuda.cuh" 

//Initialize CUDA
int InitializeCUDA(void)
{
	int count = 0;
	std::cout << "Start to detecte devices.........\n";
	cudaGetDeviceCount(&count);
	if (count == 0)
	{
		std::cerr << "There is no device.\n";
		return 1;
	}

	std::cout << count << " device detected.\n";
	int i;

	for (i = 0; i < count; i++)
	{
		cudaDeviceProp prop;
		if (cudaGetDeviceProperties(&prop, i) == cudaSuccess)
		{
			if (prop.major >= 1)
			{
				std::cout << "Device:" << i + 1 << " supports CUDA " << prop.name << "." << prop.major << "." << prop.minor << std::endl;
				break;
			}
		}
	}
	if (i == count)
	{
		std::cerr << "There is no device supporting CUDA 1.x.\n";
		return 1;
	}
	cudaSetDevice(i);


	return 2;
}

//Do clean up
int CleanUp()
{
	cudaError_t cudaStatus = cudaDeviceReset();
	if (cudaStatus != cudaSuccess) {
		fprintf(stderr, "cudaDeviceReset failed!");
		return 1;
	}
	return 0;
}

template <typename T> int sgn(T val)
{
	return (T(0) < val) - (val < T(0));
}

void somFree(float* pointer)
{
	delete[] pointer;
	pointer = NULL;
}

bool CPUcheckEuclideanResult(const float* d_result,
	const float* d_weights,
	const float* d_input,
	const unsigned int* d_BID,
	unsigned int inputIndex,
	int neuron_number,
	int batch_number,
	int dimension,
	int flag)
{
	float* h_weights = new float[neuron_number*dimension];
	float* h_input = new float[batch_number*dimension];
	float* h_checkresult = new float[neuron_number*batch_number];
	unsigned int* h_checkBID = new unsigned int[batch_number];
	cudaMemcpy(h_checkBID, d_BID, batch_number*sizeof(unsigned int), cudaMemcpyDeviceToHost);
	cudaMemcpy(h_checkresult, d_result, neuron_number*batch_number*sizeof(float), cudaMemcpyDeviceToHost);
	cudaMemcpy(h_weights, d_weights, neuron_number*dimension*sizeof(float), cudaMemcpyDeviceToHost);
	cudaMemcpy(h_input, d_input + inputIndex*dimension, batch_number*dimension*sizeof(float), cudaMemcpyDeviceToHost);
	if (flag == -1)
	{
		inputIndex += 40000000;
	}

	/*--------------- check the intermidiateResult of each batch -----------------*/
	std::ofstream fout("../result/h_intermidiateResult" + std::to_string(inputIndex) + ".txt");
	for (int i = 0; i < batch_number; ++i)
	{
		for (int j = 0; j < neuron_number; ++j)
		{
			if (j == (neuron_number - 1))
				fout << h_checkresult[j + i*neuron_number];
			else
				fout << h_checkresult[j + i*neuron_number] << " ";
		}
		if (i != (batch_number - 1))
			fout << std::endl;
	}
	fout.close();

	/*--------------- check the input of each batch -----------------*/
	fout.open("../result/h_input" + std::to_string(inputIndex) + ".txt");
	for (int i = 0; i < batch_number; ++i)
	{
		for (int j = 0; j < dimension; ++j)
		{

			if (j == (dimension - 1))
				fout << h_input[j + i*dimension];
			else
				fout << h_input[j + i*dimension] << " ";
		}
		if (i != (batch_number - 1))
			fout << std::endl;
	}
	fout.close();

	/*--------------- check the result of weights update -----------------*/
	fout.open("../result/weights" + std::to_string(inputIndex) + ".txt");
	for (int i = 0; i < neuron_number; ++i)
	{
		for (int j = 0; j < dimension; j++)
		{
			if (j == (dimension - 1))
				fout << h_weights[j*neuron_number + i];
			else
				fout << h_weights[j*neuron_number + i] << " ";
		}
		if (i != (neuron_number - 1))
			fout << std::endl;
	}
	fout.close();

	/*------------------ Check the BID ----------------*/
	fout.open("../result/bID" + std::to_string(inputIndex) + ".txt");

	for (int j = 0; j < batch_number; j++)
	{
		if (j == (batch_number - 1))
			fout << h_checkBID[j];
		else
			fout << h_checkBID[j] << std::endl;
	}
	fout.close();


	delete[] h_checkresult;
	delete[] h_input;
	delete[] h_weights;
	delete[] h_checkBID;
	h_checkBID = NULL;
	h_checkresult = NULL;
	h_input = NULL;
	h_weights = NULL;
	return true;
}

//Calculate the distance between each neuron and input vector
//this kernel assumes d_weights is column-major          d_weights(dimension, neuron_number)
//this kernel assumes d_input_set is row-major           d_input_set(batch_size, dimension)
//this kernel assumes d_result is column-major           d_result(batch_size,neuron_number)
//this kernel assumes number of threads per threadblock == DIMENSION
//CHKSIZE is the number of d_weights vectors that will be compute per block
__global__ void Calculate_Euclidean_Distance_Kernel(const float *d_weights,
	const float *d_input_set,
	const unsigned input_index_of_this_batch,
	const int batch_size,
	const int neuron_number,
	float *d_result)
{
	__shared__ float shared_input_set[CHKSIZE * DIMENSION];		//enough shared storage for CHKSIZE vectors of d_input_set	
	int bx = blockIdx.x;										//one block per CHKSIZE rows of d_input_set
	int tx = threadIdx.x;
	float result[CHKSIZE];

	int numCHKSIZE = (bx + 1) * CHKSIZE < batch_size ? CHKSIZE : batch_size - bx*CHKSIZE;
#pragma unroll
	for (int i = 0; i < numCHKSIZE; i++)
		shared_input_set[(i * DIMENSION) + tx] = d_input_set[((input_index_of_this_batch + (bx * CHKSIZE) + i) * DIMENSION) + tx];
	__syncthreads();

	//loop across all vectors in d_weights
	while (tx < neuron_number)
	{
#pragma unroll
		for (int i = 0; i < numCHKSIZE; i++)
			result[i] = 0.0f;

		for (int i = 0; i < DIMENSION; i++)
		{
			float Atemp = d_weights[(neuron_number * i) + tx];
			//compute all CHKSIZE d_input_set vectors with read of d_weights
#pragma unroll
			for (int j = 0; j < numCHKSIZE; j++)
			{
				float temp = Atemp - shared_input_set[i + (j * DIMENSION)];
				result[j] += temp * temp;
			}
		}

		//store CHKSIZE results
#pragma unroll
		for (int i = 0; i < numCHKSIZE; i++)
			d_result[(i + (bx * CHKSIZE)) * neuron_number + tx] = result[i];

		tx += blockDim.x;
	}
}


//Has not finish yet
__global__ void Calculate_Cosine_Distance_Kernel(const float *d_weights,
	const float *d_input_set,
	const unsigned input_index_of_this_batch,
	const int batch_size,
	const int neuron_number,
	float *d_result)
{
	__shared__ float shared_input_set[CHKSIZE * DIMENSION];		//enough shared storage for CHKSIZE vectors of d_input_set	
	int bx = blockIdx.x;										//one block per CHKSIZE rows of d_input_set
	int tx = threadIdx.x;
	float result[CHKSIZE];

	int numCHKSIZE = (bx + 1) * CHKSIZE < batch_size ? CHKSIZE : batch_size - bx*CHKSIZE;
#pragma unroll
	for (int i = 0; i < numCHKSIZE; ++i)
		shared_input_set[(i * DIMENSION) + tx] = d_input_set[((input_index_of_this_batch + (bx * CHKSIZE) + i) * DIMENSION) + tx];
	__syncthreads();

	//loop across all vectors in d_weights
	while (tx < neuron_number)
	{
#pragma unroll
		for (int i = 0; i < numCHKSIZE; ++i)
			result[i] = 0.0f;

		for (int i = 0; i < DIMENSION; ++i)
		{
			float Atemp = d_weights[(neuron_number * i) + tx];
			//compute all CHKSIZE d_input_set vectors with read of d_weights
#pragma unroll
			for (int j = 0; j < numCHKSIZE; ++j)
			{
				float temp = Atemp - shared_input_set[i + (j * DIMENSION)];
				result[j] += temp * temp;
			}
		}

		//store CHKSIZE results
#pragma unroll
		for (int i = 0; i < numCHKSIZE; i++)
			d_result[(i + (bx * CHKSIZE)) * neuron_number + tx] = result[i];

		tx += blockDim.x;
	}
}

__global__ void Calculate_Euclidean_Distance_Kernel_noRandomMapping(const float *d_weights,
	const int dimension,
	const float *d_input_set,
	const unsigned input_index_of_this_batch,
	const int batch_size,
	const int neuron_number,
	float *d_result)
{
	extern __shared__ float shared_input_set[];		//enough shared storage for CHKSIZE vectors of d_input_set	
	int bx = blockIdx.x;										//one block per CHKSIZE rows of d_input_set
	int tx = threadIdx.x;
	float result = 0.0f;

	while (tx < dimension)
	{
		shared_input_set[tx] = d_input_set[(input_index_of_this_batch + bx) * dimension + tx];
		tx += blockDim.x;
	}
	__syncthreads();
	tx = threadIdx.x;

	//loop across all vectors in d_weights
	while (tx < neuron_number)
	{

		for (int i = 0; i < dimension; i++)
		{
			float Atemp = d_weights[(neuron_number * i) + tx];
			//compute all CHKSIZE d_input_set vectors with read of d_weights
			float temp = Atemp - shared_input_set[i];
			result += temp * temp;
		}

		//store CHKSIZE results								
		d_result[bx * neuron_number + tx] = result;
		tx += blockDim.x;
	}
}

//Find out the index of min element
__global__ void Min_Reduce_Kernel(const float* d_result, unsigned int* d_BID, const size_t neuronNum)
{
	__shared__ float sValue[512];
	__shared__ int sIndex[512];

	int tx = threadIdx.x;
	int stride = blockIdx.x*neuronNum;
	int gid = tx + stride;
	int upper = stride + neuronNum;

	sValue[tx] = FLT_MAX;
	sIndex[tx] = gid;
	float temp;
	while (gid < upper) {
		temp = d_result[gid];

		sIndex[tx] = sValue[tx] > temp ? gid : sIndex[tx];
		sValue[tx] = sValue[tx] > temp ? temp : sValue[tx];

		gid += blockDim.x;
	}
	__syncthreads();

	if (tx < 256)
	{
		sIndex[tx] = sValue[tx] > sValue[tx + 256] ? sIndex[tx + 256] : sIndex[tx];
		sValue[tx] = sValue[tx] > sValue[tx + 256] ? sValue[tx + 256] : sValue[tx];
	}
	__syncthreads();
	if (tx < 128)
	{
		sIndex[tx] = sValue[tx] > sValue[tx + 128] ? sIndex[tx + 128] : sIndex[tx];
		sValue[tx] = sValue[tx] > sValue[tx + 128] ? sValue[tx + 128] : sValue[tx];
	}
	__syncthreads();
	if (tx < 64)
	{
		sIndex[tx] = sValue[tx] > sValue[tx + 64] ? sIndex[tx + 64] : sIndex[tx];
		sValue[tx] = sValue[tx] > sValue[tx + 64] ? sValue[tx + 64] : sValue[tx];
	}
	__syncthreads();
	if (tx < 32)
	{
		if (sValue[tx] > sValue[tx + 32])
		{
			sValue[tx] = sValue[tx + 32];
			sIndex[tx] = sIndex[tx + 32];
		}
		if (sValue[tx] > sValue[tx + 16])
		{
			sValue[tx] = sValue[tx + 16];
			sIndex[tx] = sIndex[tx + 16];
		}
		if (sValue[tx] > sValue[tx + 8])
		{
			sValue[tx] = sValue[tx + 8];
			sIndex[tx] = sIndex[tx + 8];
		}
		if (sValue[tx] > sValue[tx + 4])
		{
			sValue[tx] = sValue[tx + 4];
			sIndex[tx] = sIndex[tx + 4];
		}

		if (sValue[tx] > sValue[tx + 2])
		{
			sValue[tx] = sValue[tx + 2];
			sIndex[tx] = sIndex[tx + 2];
		}
		//sIndex[tx] = sValue[tx] > sValue[tx+2] ? sIndex[tx+2] : sIndex[tx];
		//sValue[tx] = sValue[tx] > sValue[tx+2] ? sValue[tx+2] : sValue[tx];

		sIndex[tx] = sValue[tx] > sValue[tx + 1] ? sIndex[tx + 1] : sIndex[tx];
		sValue[tx] = sValue[tx] > sValue[tx + 1] ? sValue[tx + 1] : sValue[tx];
	}
	if (tx == 0)
	{
		d_BID[blockIdx.x] = sIndex[0] - stride;
		//d_error[blockIdx.x] = sValue[0];
	}
}

//Find the best match neuron by using bathc kernel function.
bool Find_Best_Match_Neuron(const float* d_weights,
	const unsigned int neuron_number,
	const float* d_input_set,
	const unsigned int input_index_of_this_batch,
	const unsigned int batch_size,
	unsigned int* d_BID,
	float* d_result,
	std::ofstream &fout)
{
	cudaError_t cudaStatus;
	fout << "real blocks in find_best_match_neuron " << (double)batch_size / (double)CHKSIZE << std::endl;
	fout << "blocks in find_best_match_neuron " << ceil((double)batch_size / (double)CHKSIZE) << std::endl;
	dim3 threads(DIMENSION);
	dim3 blocks(ceil((double)batch_size / (double)CHKSIZE));
	Calculate_Euclidean_Distance_Kernel <<<blocks, threads >>>(d_weights, d_input_set, input_index_of_this_batch, batch_size, neuron_number, d_result);
	cudaStatus = cudaDeviceSynchronize();
	if (cudaStatus != cudaSuccess) {
		fprintf(stderr, "cudaDeviceSynchronize returned error code %d after launching EuclideanDistancesBMU!\n", cudaStatus);
		return false;
	}

	cudaFuncSetCacheConfig(Min_Reduce_Kernel, cudaFuncCachePreferL1);
	Min_Reduce_Kernel <<<batch_size, 512 >>>(d_result, d_BID, neuron_number);
	cudaStatus = cudaDeviceSynchronize();
	if (cudaStatus != cudaSuccess) {
		fprintf(stderr, "cudaDeviceSynchronize returned error code %d after launching min reduce!\n", cudaStatus);
		return false;
	}

	return true;
}

//Find the best match neuron by using bathc kernel function.
bool output_BID(const float* d_weights,
	const unsigned int neuron_number,
	const float* d_input_set,
	unsigned int input_index_of_this_batch,
	unsigned int batch_size, unsigned int* d_BID, float* d_result)
{
	cudaError_t cudaStatus;
	dim3 threads(DIMENSION);
	dim3 blocks(ceil((double)batch_size / (double)CHKSIZE));
	//Calculate_Euclidean_Distance_Kernel_noRandomMapping<<<batch_size,1024,dimension*sizeof(float)>>>(d_weights,dimension,d_input_set,input_index_of_this_batch,batch_size,neuron_number,d_result);
	Calculate_Euclidean_Distance_Kernel << <blocks, threads >> >(d_weights, d_input_set, input_index_of_this_batch, batch_size, neuron_number, d_result);
	cudaStatus = cudaDeviceSynchronize();
	if (cudaStatus != cudaSuccess) {
		fprintf(stderr, "cudaDeviceSynchronize returned error code %d after launching EuclideanDistancesBMU!\n", cudaStatus);
		return false;
	}

	cudaFuncSetCacheConfig(Min_Reduce_Kernel, cudaFuncCachePreferL1);
	Min_Reduce_Kernel << <batch_size, 512 >> >(d_result, d_BID, neuron_number);
	cudaStatus = cudaDeviceSynchronize();
	if (cudaStatus != cudaSuccess) {
		fprintf(stderr, "cudaDeviceSynchronize returned error code %d after launching min reduce!\n", cudaStatus);
		return false;
	}

	return true;
}

//Update weight of each neuron
__global__ void Bad_Update_Map_Map_Kernel(const float* d_input_set, const int input_index_of_this_batch, const int* d_position, const unsigned int* bID, const unsigned int batch_size, const float fsigmaT, float* d_weights)
{
	int tx = threadIdx.x;
	int bx = blockIdx.x;
	float denominator = 0.f;
	float numerator = 0.f;
	int index_factor = gridDim.x - 1;
	int DIMENSIONxCHKSIZE = DIMENSION*CHKSIZE;
	__shared__ float tempDenominator[DIMENSION*CHKSIZE];		//DIMENSION*CHKSIZE
	int j = 0;
	while (tx < batch_size)
	{

		//Calculate the influence of each input vector
		for (int i = 0; i < CHKSIZE; i++)
		{
			int bid = bID[tx];				//the id of best match neuron
			int tempX = (d_position[2 * bx] - d_position[2 * bid]);
			int tempY = (d_position[2 * bx + 1] - d_position[2 * bid + 1]);
			float tempDist = tempX*tempX + tempY*tempY;
			tempDenominator[tx + (i * DIMENSION)] = bx^bid ? expf(-tempDist / fsigmaT) : 1;
		}
		__syncthreads();

		//Sum up the influence
		for (int i = 0; i < DIMENSIONxCHKSIZE; i++)
		{
			numerator += tempDenominator[i] * d_input_set[threadIdx.x + ((input_index_of_this_batch + (j * DIMENSIONxCHKSIZE) + i) * DIMENSION)];
			denominator += tempDenominator[i];
		}
		++j;
		tx += DIMENSIONxCHKSIZE;
	}
	//Update the weight of each neuron
	d_weights[threadIdx.x * gridDim.x + bx] = denominator;// numerator / 
}

//Update weight of each neuron
__global__ void Update_Map_Map_Kernel(const float* d_input_set,
	const int input_index_of_this_batch,
	const float* d_distance,
	const unsigned int* bID,
	const unsigned int batch_size,
	const float fsigmaT,
	float* d_weights)
{
	int tx = threadIdx.x;
	int bx = blockIdx.x;
	float denominator = 0.f;
	float numerator = 0.f;
	int index_factor = gridDim.x - 1;
	__shared__ float tempDenominator[DIMENSION];		//DIMENSION*CHKSIZE
	//int j = 0;
	int count = 0;
	int upper = ceilf((float)batch_size / (float)DIMENSION);
	for (int j = 0; j < upper; ++j)
	{
		if (tx < batch_size)
		{
			int bid = bID[tx];				//the id of best match neuron
			/* Find the bigger one between bid and bx, 'a' is the bigger one*/
			int a = bx + bid;
			int b = bx < bid ? bx : bid;
			a = a - b;
			int index = a + index_factor * b - 1 - (b + 1) * b * 0.5;

			//Calculate the influence of each input vector
			float tempDist = bx^bid ? d_distance[index + 1] : 0;

			tempDenominator[threadIdx.x] = bx^bid ? expf(-tempDist / fsigmaT) : 1;
			__syncthreads();
		}

		count = (j + 1)*DIMENSION < batch_size ? DIMENSION : (batch_size - j * DIMENSION);
		//Sum up the influence
		for (int i = 0; i < count; i++)
		{
			numerator += tempDenominator[i] * d_input_set[threadIdx.x + ((input_index_of_this_batch + (j * DIMENSION) + i) * DIMENSION)];
			denominator += tempDenominator[i];
		}
		tx += DIMENSION;
	}
	//Update the weight of each neuron
	d_weights[threadIdx.x * gridDim.x + bx] = numerator / denominator;
}

__global__ void Update_Map_Map_Kernel_noRandomMapping(const float* d_input_set,
	const int dimension,
	const int input_index_of_this_batch,
	const float* d_distance,
	const unsigned int* bID,
	const unsigned int batch_size,
	const float fsigmaT,
	float* d_weights)
{
	int tx = threadIdx.x;
	int by = blockIdx.y;
	int bx = blockIdx.x;
	float denominator = 0.f;
	float numerator = 0.f;
	int index_factor = gridDim.y - 1;
	__shared__ float tempDenominator[512];		//DIMENSION*CHKSIZE
	int j = 0;
	int tid = bx*blockDim.x + threadIdx.x;
	int count = 0;
	while (tx < batch_size)
	{
		int bid = bID[tx];				//the id of best match neuron
		/* Find the bigger one between bid and by, 'a' is the bigger one*/
		int a = by + bid;
		int b = by < bid ? by : bid;
		a = a - b;
		int index = a + index_factor * b - 1 - (b + 1) * b * 0.5;

		//Calculate the influence of each input vector
		float tempDist = by^bid ? d_distance[index + 1] : 0;

		tempDenominator[threadIdx.x] = by^bid ? expf(-tempDist / fsigmaT) : 1;
		__syncthreads();


		if (tid < dimension)
		{
			count = (j + 1) * 512 < batch_size ? 512 : (batch_size - j * 512);
			//Sum up the influence
			for (int i = 0; i < count; i++)
			{
				numerator += tempDenominator[i] * d_input_set[tid + ((input_index_of_this_batch + (j * 512) + i) * dimension)];
				denominator += tempDenominator[i];
			}
		}

		++j;
		tx += blockDim.x;
	}
	if (tid < dimension)
		//Update the weight of each neuron
		d_weights[tid * gridDim.y + by] = numerator / denominator;
}


//Update weight of each neuron vector
bool Update_Map(const float* d_distance,
	const unsigned int neuron_number,
	const float* d_input_set,
	const int input_index_of_this_batch,
	const unsigned int* bID,
	const unsigned int batch_size,
	const int dimension,
	const float fsigmaT,
	float * d_weights)
{

	cudaError_t cudaStatus;
	cudaFuncSetCacheConfig(Update_Map_Map_Kernel, cudaFuncCachePreferL1);
	//dim3 blocks(ceil((double)dimension/512.0),neuron_number);
	//Update_Map_Map_Kernel<<<blocks,512>>>(d_input_set,dimension,input_index_of_this_batch,d_distance,bID,batch_size,
	Update_Map_Map_Kernel <<<neuron_number, DIMENSION>>>(d_input_set, input_index_of_this_batch, d_distance, bID, batch_size, fsigmaT, d_weights);
	cudaStatus = cudaDeviceSynchronize();
	if (cudaStatus != cudaSuccess) 
	{
		fprintf(stderr, "Update_Map_Map_Kernel returned error code %d after launching Update_Map_Map_Kernel!\n", cudaStatus);
		std::cout << input_index_of_this_batch << " " << batch_size << " " << fsigmaT << std::endl;
		std::ofstream ferr_BID("../result/error_BID.txt");
		std::ofstream ferr_Input("../result/error_input.txt");
		int * e_BID = new int[batch_size];
		float * e_input_set = new float[dimension*batch_size];
		cudaMemcpy(e_BID, bID, batch_size*sizeof(unsigned int), cudaMemcpyDeviceToHost);
		cudaMemcpy(e_input_set, d_input_set + dimension*input_index_of_this_batch, dimension*batch_size*sizeof(float), cudaMemcpyDeviceToHost);
		for (int i = 0; i < batch_size; i++)
		{
			ferr_BID << e_BID[i] << std::endl;
			for (int j = 0; j < dimension; ++j)
			{
				if (j == (dimension - 1))
					ferr_Input << e_input_set[j + i*dimension];
				else
					ferr_Input << e_input_set[j + i*dimension] << " ";
			}
			if (i != (batch_size - 1))
				ferr_Input << std::endl;
		}
		return false;
	}
	return true;
}

//A function for randomMapping. It's not use until now.
float* RandomMapping(const float* h_gaussin,
	const float *h_source,
	const int dimension_after_random_mapping,
	const int dimension_before_random_mapping,
	const int input_set_size)
{
	float *d_source, *d_gaussin, *d_result;

	cublasInit();

	cublasAlloc(input_set_size * dimension_before_random_mapping, sizeof(float), (void**)&d_source);
	cublasAlloc(dimension_after_random_mapping * dimension_before_random_mapping, sizeof(float), (void**)&d_gaussin);
	cublasAlloc(dimension_after_random_mapping * input_set_size, sizeof(float), (void**)&d_result);
	cublasSetMatrix(dimension_before_random_mapping, input_set_size, sizeof(float), h_source, dimension_before_random_mapping, d_source, dimension_before_random_mapping);
	cublasSetMatrix(dimension_after_random_mapping, dimension_before_random_mapping, sizeof(float), h_gaussin, dimension_after_random_mapping, d_gaussin, dimension_after_random_mapping);

	cudaThreadSynchronize();

	cublasSgemm('n', 'n',
		dimension_after_random_mapping, input_set_size, dimension_before_random_mapping,
		1.0f, d_gaussin, dimension_after_random_mapping,
		d_source, dimension_before_random_mapping,
		0.0f, d_result, dimension_after_random_mapping);

	cudaThreadSynchronize();
	cudaFree(d_gaussin);
	cudaFree(d_source);

	return d_result;
}

//unsigned int* SOM(const float* h_inputSet,
//	const unsigned int input_set_size,
//	const unsigned int dimension,
//	const unsigned int height,
//	const unsigned int width,
//	const unsigned int batch_size,
//	const int epochNum,
//	const float lambda,
//	const float iterNum)
//{
//	const unsigned int d_input_set_size = input_set_size;							//define the input set size on device
//	const unsigned int neuron_number = height * width;								//the number of neuron
//	const unsigned int real_dimension = dimension;
//	float iter = 0;																	//iteration
//
//	int distance_table_length = (int)(1 +
//		neuron_number * (neuron_number - 1) * 0.5);		//the length of distance Table
//	float* h_weights = new float[real_dimension * neuron_number];					//weights of each neuron in host memory
//	float* h_distance = new float[distance_table_length];							//distance table in host memory
//	int* h_position = new int[2 * neuron_number];									//position--(x,y)--of each neuron in host memory
//
//	float* d_weights = 0;															//weights of each neuron in device memory
//	float* d_distance = 0;															//distance table in device memory
//	float* d_input_set = 0;															//input set in device memory
//	unsigned int* d_BID = 0;														//the id of best match neurons in device memory
//	float* d_intermediate_result = 0;
//
//	cudaMalloc((void**)&d_weights, real_dimension * neuron_number * sizeof(float));
//	cudaMalloc((void**)&d_distance, distance_table_length * sizeof(float));
//	cudaMalloc((void**)&d_BID, batch_size * sizeof(unsigned int));
//	cudaMalloc((void**)&d_intermediate_result, neuron_number * batch_size * sizeof(float));
//	cudaMalloc((void**)&d_input_set, real_dimension*d_input_set_size*sizeof(float));
//	cudaMemcpy(d_input_set, h_inputSet, real_dimension*d_input_set_size*sizeof(float), cudaMemcpyHostToDevice);
//
//	/*----------------- Initialize the distance table --------------------*/
//	bool flag = true;
//	int x = 0;
//	int y = 0;
//	for (int i = 0, t = 0; i < height; ++i)
//	{
//		x = 0;
//		for (int j = 0; j < 2 * width; ++j)
//		{
//
//			if (flag)
//			{
//				h_position[t] = x;
//				flag = false;
//				++x;
//				++t;
//
//			}
//			else
//			{
//				h_position[t] = y;
//				flag = true;
//				++t;
//
//			}
//		}
//		y++;
//	}
//
//	h_distance[0] = 0;
//	for (unsigned int i = 0, t = 1; i < neuron_number - 1; ++i)
//	{
//		for (unsigned int j = i + 1; j < neuron_number; ++j)
//		{
//			int dX = (h_position[2 * i] - h_position[2 * j]) * (h_position[2 * i] - h_position[2 * j]);
//			int dY = (h_position[2 * i + 1] - h_position[2 * j + 1]) * (h_position[2 * i + 1] - h_position[2 * j + 1]);
//			h_distance[t] = dX + dY;
//			++t;
//		}
//	}
//	cudaMemcpy(d_distance, h_distance, distance_table_length * sizeof(float), cudaMemcpyHostToDevice);
//
//	std::cout << "Initialize the positioin done" << std::endl;
//
//	/*-----------Initialize the weights of each neuron---------------------*/
//	float *h_temp_weight = new float[neuron_number*real_dimension];
//	cudaMemcpy(h_temp_weight, d_input_set, neuron_number*real_dimension*sizeof(float), cudaMemcpyDeviceToHost);
//	for (unsigned int i = 0; i < neuron_number; ++i)
//	{
//		for (unsigned int j = 0; j < real_dimension; ++j)
//		{
//			h_weights[i + j * neuron_number] = h_temp_weight[i*real_dimension + j];
//		}
//	}
//	cudaMemcpy(d_weights, h_weights, neuron_number* real_dimension  * sizeof(float), cudaMemcpyHostToDevice);
//	delete[] h_temp_weight;
//	h_temp_weight = NULL;
//	std::cout << "Initialize the weights done" << std::endl;
//
//	//Let's begin SOM
//	for (int i = 0; i < epochNum; i++)
//	{
//		for (unsigned int iCycle = 0; iCycle < (d_input_set_size / batch_size); iCycle++)
//		{
//			int inputx = iCycle * batch_size;
//			if (!Find_Best_Match_Neuron(d_weights, neuron_number, d_input_set, inputx, batch_size, d_BID, d_intermediate_result))
//			{
//				break;
//			}
//
//			//float sigmaT = (0.5*height * exp(-iter/lambda));
//			float sigmaT = 0.28*width*(1 - lambda*iter);
//			if (sigmaT < 0.5)
//				sigmaT = 0.5;
//			std::cout << sigmaT << std::endl;
//			sigmaT = 2 * sigmaT * sigmaT;
//			if (!Update_Map(d_distance, neuron_number, d_input_set, inputx, d_BID, batch_size, real_dimension, sigmaT, d_weights))
//			{
//				break;
//			}
//			iter += iterNum;
//		}
//	}
//
//	std::cout << "Som training done" << std::endl;
//
//	unsigned int* h_output = new unsigned int[input_set_size];
//	for (unsigned int iCycle = 0; iCycle < (d_input_set_size / batch_size); iCycle++)
//	{
//		int inputx = iCycle * batch_size;
//		std::cout << inputx << std::endl;
//		if (!Find_Best_Match_Neuron(d_weights, neuron_number, d_input_set, inputx, batch_size, d_BID, d_intermediate_result))
//		{
//			break;
//		}
//		cudaMemcpy(h_output + inputx, d_BID, batch_size*sizeof(unsigned int), cudaMemcpyDeviceToHost);
//	}
//
//	/*--------------- check the result of final weights update -----------------*/
//	std::ofstream fweightout("../data/somweightsFinal");
//	cudaMemcpy(h_weights, d_weights, neuron_number * real_dimension * sizeof(float), cudaMemcpyDeviceToHost);
//	for (int i = 0; i < neuron_number; ++i)
//	{
//		for (int j = 0; j < dimension; j++)
//		{
//			fweightout << h_weights[i + j * neuron_number] << " ";
//		}
//		fweightout << std::endl;
//	}
//	fweightout.close();
//
//	std::cout << "everything done" << std::endl;
//	cudaFree(d_weights);
//	cudaFree(d_input_set);
//	cudaFree(d_BID);
//	cudaFree(d_intermediate_result);
//	cudaFree(d_distance);
//	delete[] h_position;
//	delete[] h_weights;
//	delete[] h_distance;
//	h_distance = NULL;
//	h_position = NULL;
//	h_weights = NULL;
//
//	return h_output;
//}

unsigned int* SOMwithRandomMapping(const float* h_gaussin,
	const float* h_inputSet,
	const unsigned int input_set_size,
	const unsigned int dimension,
	const unsigned int height,
	const unsigned int width,
	const unsigned int batch_size,
	const int epochNum,
	const float lambda,
	const float iterNum)
{
	std::string logPath = "D:\\SOMLog\\";
	std::ofstream fout(logPath + "somlog");
	fout << "here we go" << std::endl;
	
	const unsigned int d_input_set_size = input_set_size;								//define the input set size on device
	const unsigned int dimension_before_random_mapping = dimension;						//the original dimension of the input set
	const unsigned int dimension_after_random_mapping = DIMENSION;						//dimension after random mapping, can not change
	const unsigned int neuron_number = height * width;									//the number of neuron
	float iter = 0;																		//iteration

	int distance_table_length = (int)(1 +
		neuron_number * (neuron_number - 1) * 0.5);										//the length of distance Table
	float* h_weights = new float[dimension_after_random_mapping * neuron_number];		//weights of each neuron in host memory
	float* h_distance = new float[distance_table_length];								//distance table in host memory
	int* h_position = new int[2 * neuron_number];										//position--(x,y)--of each neuron in host memory

	float* d_weights = 0;																//weights of each neuron in device memory
	float* d_distance = 0;																//distance table in device memory
	unsigned int* d_BID = 0;															//the id of best match neurons in device memory
	float* d_intermediate_result = 0;
	float* d_input_set = 0;																//input set in device memory

	cudaMalloc((void**)&d_weights, dimension_after_random_mapping * neuron_number * sizeof(float));
	cudaMalloc((void**)&d_distance, distance_table_length * sizeof(float));
	cudaMalloc((void**)&d_BID, batch_size * sizeof(unsigned int));
	cudaMalloc((void**)&d_intermediate_result, neuron_number * batch_size * sizeof(float));
	d_input_set = RandomMapping(h_gaussin, h_inputSet, dimension_after_random_mapping, dimension_before_random_mapping, input_set_size);

	/*--------------- check the result of random mapping -----------------*/
	/*float* h_checkRM = new float[dimension_after_random_mapping*input_set_size];
	cudaMemcpy(h_checkRM,d_input_set,dimension_after_random_mapping*input_set_size*sizeof(float),cudaMemcpyDeviceToHost);
	fout.open(logPath+"rmvtrain");
	for(int i =0; i<input_set_size;++i)
	{
	for(int j = 0; j<dimension_after_random_mapping;++j)
	{
	if (j == (dimension_after_random_mapping - 1))
	{
	fout << h_checkRM[j + i*dimension_after_random_mapping];
	}
	else
	{
	fout << h_checkRM[j + i*dimension_after_random_mapping] << " ";
	}

	}
	if(i!=(input_set_size -1 ))
	fout<<std::endl;
	}
	fout.close();
	delete[] h_checkRM;
	h_checkRM = NULL;*/
	//fout.open("../data/vtrain");
	//for(int i =0; i<input_set_size;++i)
	//{
	//	for(int j = 0; j<dimension_before_random_mapping;++j)
	//	{
	//		if(j == (dimension_before_random_mapping - 1))
	//			fout<<h_inputSet[j+i*dimension_before_random_mapping];
	//		else
	//			fout<<h_inputSet[j+i*dimension_before_random_mapping]<<" ";
	//	}
	//	if(i!=(input_set_size -1 ))
	//		fout<<std::endl;
	//}
	//fout.close();

	/*----------------- Initialize the position table --------------------*/
	bool flag = true;
	int x = 0;
	int y = 0;
	for (int i = 0, t = 0; i < height; ++i)
	{
		//x = (i+1)/2;
		x = 0;
		for (int j = 0; j < 2 * width; ++j)
		{
			if (flag)
			{
				h_position[t] = x;
				flag = false;
				++x;
				++t;
			}
			else
			{
				h_position[t] = y;
				flag = true;
				++t;
			}
		}
		y++;
	}
	std::cout << "Initialize the positioin done" << std::endl;
	/*----------------- Initialize the distance table --------------------*/
	h_distance[0] = 0;
	for (unsigned int i = 0, t = 1; i < neuron_number - 1; ++i)
	{
		for (unsigned int j = i + 1; j < neuron_number; ++j)
		{
			int dX = (h_position[2 * i] - h_position[2 * j]) * (h_position[2 * i] - h_position[2 * j]);
			int dY = (h_position[2 * i + 1] - h_position[2 * j + 1]) * (h_position[2 * i + 1] - h_position[2 * j + 1]);

			if( sgn<int>(dX) == sgn<int>(dY))
			{
				h_distance[t] = abs(dX + dY);
			}
			else
			{
				h_distance[t] = abs(dX) > abs(dY) ? abs(dX) : abs(dY);
			}
			h_distance[t]  = h_distance[t] * h_distance[t] ;

			//h_distance[t] = dX + dY;
			++t;
		}
	}
	cudaMemcpy(d_distance, h_distance, distance_table_length * sizeof(float), cudaMemcpyHostToDevice);
	std::cout << "Initialize the distance done" << std::endl;

	/*-----------Initialize the weights of each neuron---------------------*/
	cudaMemcpy(d_weights, d_input_set, neuron_number* dimension_after_random_mapping  * sizeof(float), cudaMemcpyDeviceToDevice);
	std::cout << "Initialize the weights done" << std::endl;

	fout << "cicle times " << floor(d_input_set_size / batch_size) << std::endl;
	//Let's begin SOM
	for (int i = 0; i < epochNum; i++)
	{
		for (unsigned int iCycle = 0; iCycle < floor(d_input_set_size / batch_size); iCycle++)
		{
			int inputx = iCycle * batch_size;
			if (!Find_Best_Match_Neuron(d_weights, neuron_number, d_input_set, inputx, batch_size, d_BID, d_intermediate_result,fout))
			{
				break;
			}

			//float sigmaT = (0.5*height * exp(-iter/lambda));
			float sigmaT = 0.28*width*(1 - lambda*iter);
			if (sigmaT < 1)
				sigmaT = 1;
			std::cout << sigmaT << std::endl;
			sigmaT = 2 * sigmaT * sigmaT;
			if (!Update_Map(d_distance, neuron_number, d_input_set, inputx, d_BID, batch_size, dimension_after_random_mapping, sigmaT, d_weights))
			{
				break;
			}
			iter += iterNum;
		}
	}

	std::cout << "Som training done" << std::endl;

	unsigned int* h_output = new unsigned int[input_set_size];
	for (unsigned int iCycle = 0; iCycle < (d_input_set_size / batch_size); iCycle++)
	{
		int inputx = iCycle * batch_size;
		std::cout << inputx << std::endl;
		if (!Find_Best_Match_Neuron(d_weights, neuron_number, d_input_set, inputx, batch_size, d_BID, d_intermediate_result,fout))
		{
			break;
		}
		cudaMemcpy(h_output + inputx, d_BID, batch_size*sizeof(unsigned int), cudaMemcpyDeviceToHost);
	}

	/*--------------- check the result of final weights update -----------------*/
	//std::ofstream fweightout("../data/weightsFinal");
	//cudaMemcpy(h_weights, d_weights, neuron_number * dimension_after_random_mapping * sizeof(float),cudaMemcpyDeviceToHost);
	//for(int i = 0; i < neuron_number; ++i)
	//{
	//	for(int j = 0; j<  dimension_after_random_mapping; j++)
	//	{
	//		fweightout<<h_weights[i + j * neuron_number] <<" ";
	//	}
	//	fweightout<<std::endl;
	//}
	//fweightout.close();

	std::cout << "everything done" << std::endl;
	cudaFree(d_weights);
	cudaFree(d_input_set);
	cudaFree(d_BID);
	cudaFree(d_intermediate_result);
	cudaFree(d_distance);
	delete[] h_position;
	delete[] h_weights;
	delete[] h_distance;
	h_distance = NULL;
	h_position = NULL;
	h_weights = NULL;

	fout.close();

	return h_output;
}

unsigned int* AbstractSOMClassificationwithRandomMapping(std::string mapWeight,
	const float* h_gaussin,
	const float* h_inputSet,
	const unsigned int input_set_size,
	const unsigned int dimension,
	const unsigned int height,
	const unsigned int width,
	const unsigned int batch_size,
	const unsigned int groupsNum)
{
	unsigned int d_input_set_size = input_set_size;										//define the input set size on device
	const unsigned int dimension_before_random_mapping = dimension;						//the original dimension of the input set
	const unsigned int dimension_after_random_mapping = DIMENSION;						//dimension after random mapping, can not change
	const unsigned int neuron_number = height * width;									//the number of neuron

	float* h_weights = new float[dimension_after_random_mapping * neuron_number];		//weights of each neuron in host memory

	float* d_weights = 0;																//weights of each neuron in device memory
	float* d_input_set = 0;																//input set in device memory
	unsigned int* d_BID = 0;															//the id of best match neurons in device memory
	float* d_intermediate_result = 0;
	cudaMalloc((void**)&d_weights, dimension_after_random_mapping * neuron_number * sizeof(float));
	cudaMalloc((void**)&d_BID, batch_size * sizeof(unsigned int));
	cudaMalloc((void**)&d_intermediate_result, neuron_number * batch_size * sizeof(float));

	float* temp_d_input_set = RandomMapping(h_gaussin, h_inputSet, dimension_after_random_mapping - groupsNum, dimension_before_random_mapping, input_set_size);

	if (groupsNum == 0)
	{
		d_input_set = temp_d_input_set;
		temp_d_input_set = NULL;
	}
	else
	{
		float* zero = new float[groupsNum];
		for (int i = 0; i < groupsNum; ++i)
		{
			zero[i] = 0;
		}

		cudaMalloc((void**)&d_input_set, dimension_after_random_mapping*d_input_set_size*sizeof(float));
		for (int i = 0; i < d_input_set_size; ++i)
		{
			cudaMemcpy(d_input_set + i*dimension_after_random_mapping,
				temp_d_input_set + i*(dimension_after_random_mapping - groupsNum),
				(dimension_after_random_mapping - groupsNum)*sizeof(float),
				cudaMemcpyDeviceToDevice);
			cudaMemcpy(d_input_set + (i + 1)*(dimension_after_random_mapping)-groupsNum,
				zero,
				groupsNum*sizeof(float),
				cudaMemcpyHostToDevice);
		}
		delete[] zero;
		zero = NULL;
		cudaFree(temp_d_input_set);
	}
	/* ------------------- check inpout set --------------------*/
	//float* h_checkRM = new float[dimension_after_random_mapping*input_set_size];
	//cudaMemcpy(h_checkRM,d_input_set,dimension_after_random_mapping*input_set_size*sizeof(float),cudaMemcpyDeviceToHost);
	//std::ofstream fout("../data/rmvtest");
	//for(int i =0; i<input_set_size;++i)
	//{
	//	for(int j = 0; j<dimension_after_random_mapping;++j)
	//	{
	//		if(j == (dimension_after_random_mapping - 1))
	//			fout<<h_checkRM[j+i*dimension_after_random_mapping];
	//		else
	//			fout<<h_checkRM[j+i*dimension_after_random_mapping]<<" ";
	//	}
	//	if(i!=(input_set_size -1 ))
	//		fout<<std::endl;
	//}
	//fout.close();
	//delete[] h_checkRM;
	//h_checkRM = NULL;
	//fout.open("../data/vtest");
	//for(int i =0; i<input_set_size;++i)
	//{
	//	for(int j = 0; j<dimension_before_random_mapping;++j)
	//	{
	//		if(j == (dimension_before_random_mapping - 1))
	//			fout<<h_inputSet[j+i*dimension_before_random_mapping];
	//		else
	//			fout<<h_inputSet[j+i*dimension_before_random_mapping]<<" ";
	//	}
	//	if(i!=(input_set_size -1 ))
	//		fout<<std::endl;
	//}
	//fout.close();

	/*-----------Initialize the weights of each neuron---------------------*/
	std::ifstream fin(mapWeight);
	for (unsigned int i = 0; i < neuron_number; ++i)
	{
		for (unsigned int j = 0; j < dimension_after_random_mapping; ++j)
		{
			fin >> h_weights[i + j * neuron_number];
		}
	}
	cudaMemcpy(d_weights, h_weights, neuron_number* dimension_after_random_mapping  * sizeof(float), cudaMemcpyHostToDevice);
	std::cout << "Initialize the weights done" << std::endl;

	unsigned int* h_output = new unsigned int[input_set_size];
	for (unsigned int iCycle = 0; iCycle < (d_input_set_size / batch_size); iCycle++)
	{
		int inputx = iCycle * batch_size;
		std::cout << inputx << std::endl;
		if (!output_BID(d_weights, neuron_number, d_input_set, inputx, batch_size, d_BID, d_intermediate_result))
		{
			break;
		}
		cudaMemcpy(h_output + inputx, d_BID, batch_size*sizeof(unsigned int), cudaMemcpyDeviceToHost);
	}

	std::cout << "everything done" << std::endl;
	cudaFree(d_weights);
	cudaFree(d_input_set);
	cudaFree(d_BID);
	cudaFree(d_intermediate_result);
	delete[] h_weights;
	h_weights = NULL;

	return h_output;
}


unsigned int* SOMRefineClassificationwithRandomMapping(const float* h_gaussin,
	const float* h_inputSet,
	const unsigned int input_set_size,
	const unsigned int dimension,
	const unsigned int height,
	const unsigned int width,
	const unsigned int batch_size,
	const unsigned int groupsNum)
{
	return AbstractSOMClassificationwithRandomMapping("../data/somweightsFinal",
		h_gaussin,
		h_inputSet,
		input_set_size,
		dimension,
		height,
		width,
		batch_size,
		groupsNum);
}

unsigned int* SOMClassificationwithRandomMapping(const float* h_gaussin,
	const float* h_inputSet,
	const unsigned int input_set_size,
	const unsigned int dimension,
	const unsigned int height,
	const unsigned int width,
	const unsigned int batch_size,
	const unsigned int groupsNum)
{
	return AbstractSOMClassificationwithRandomMapping("../data/weightsFinal",
		h_gaussin,
		h_inputSet,
		input_set_size,
		dimension,
		height,
		width,
		batch_size,
		groupsNum);
}
