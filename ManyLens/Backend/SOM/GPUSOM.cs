using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.InteropServices;
using System.Diagnostics;
using ManyLens.myMath;
using ManyLens.Models;
using System.IO;

namespace ManyLens.SOM
{
    public class GPUSOM
    {
        //Initialize CUDA runtime
        [DllImport("ManyLens-SOM_CUDA.dll")]
        private static extern int InitializeCUDA();

        //Do cleanup when close the program
        [DllImport("ManyLens-SOM_CUDA.dll")]
        private static extern int CleanUp();

        [DllImport("ManyLens-SOM_CUDA.dll")]
        private static extern IntPtr SOMwithRandomMapping(float[] h_gaussin,
                                                         float[] h_inputSet,
                                                         float[] h_initial_weight,
                                                         int input_set_size,
                                                         int dimension,
                                                         int height,
                                                         int width,
                                                         int batch_size,
                                                         int epochNum,
                                                         float lambda,
                                                         float iterNum);

        [DllImport("ManyLens-SOM_CUDA.dll")]
        private static extern IntPtr SOMClassificationwithRandomMapping(float[] h_gaussin,
                                                                     float[] h_inputSet,
                                                                     float[] h_classifier_weight,
                                                                     int input_set_size,
                                                                     int dimension,
                                                                     int height,
                                                                     int width,
                                                                     int batch_size);

        [DllImport("ManyLens-SOM_CUDA.dll")]
        private static extern IntPtr SOMRefinewithRandomMapping(float[] h_gaussin,
                                                                float[] h_inputSet,
                                                                int[] h_BID,
                                                                float[] h_classifier_weight,
                                                                int input_set_size,
                                                                int dimension,
                                                                int height,
                                                                int width,
                                                                int batch_size);

        [DllImport("ManyLens-SOM_CUDA.dll")]
        private static extern IntPtr FindBID(float[] h_gaussin,
                                            float[] input_vector, int input_set_size, int dimension,
                                            float[] weights, int weights_size);

        [DllImport("ManyLens-SOM_CUDA.dll")]
        private static extern void somFree(IntPtr pointer);



        public static VisMap TweetSOMClassification(string mapID, Interval interval, VisMap classifier)
        {
            InitializeCUDA();
            int trainsetSize = interval.TweetsCount;
            float[] trainset = interval.GetHashVector(trainsetSize);
            Debug.WriteLine("Set the parameter for SOM");
            //set the resolution of SOM map
            int width = 32;
            int height = 16;
            int neuronNum = width * height;
            //set the batch size
            int batch_size = trainsetSize;

            IntPtr pointer = SOMClassificationwithRandomMapping(config.Parameter.RmMatrix,
                                                                trainset,
                                                                classifier.MapWeightInColumnMajor,
                                                                trainsetSize,
                                                                config.Parameter.HashDimension,
                                                                height,
                                                                width,
                                                                batch_size);
            Debug.WriteLine("SOM Finish");

            int[] h_BID = new int[trainsetSize];
            Marshal.Copy(pointer, h_BID, 0, trainsetSize);

            float[] h_error = new float[trainsetSize];
            Marshal.Copy(IntPtr.Add(pointer, trainsetSize * sizeof(int)), h_error, 0, trainsetSize);
            somFree(pointer);

            float[] h_weight = classifier.MapWeightInColumnMajor;

            //construct the som map for visualization
            VisMap visMap = new VisMap(mapID, width, height, h_weight, h_BID, h_error, interval);
            try
            {
                for (int i = 0; i < trainsetSize; ++i)
                {
                    //sw.WriteLine(h_output[i]);
                    if (!visMap.TryAddTweetToUnit(h_BID[i], h_error[i], interval.Tweets[i]))
                    {
                        float[] unitWeightVector = new float[config.Parameter.DimensionAfterRandomMapping];
                        for (int j = 0, lenj = config.Parameter.DimensionAfterRandomMapping; j < lenj; ++j)
                        {
                            unitWeightVector[j] = h_weight[j * neuronNum + h_BID[i]];
                        }
                        Unit unit = new Unit(h_BID[i] % width, h_BID[i] / width, h_BID[i], unitWeightVector, interval);
                        Tweet tweet = interval.Tweets[i];
                        unit.AddTweet(h_error[i], tweet);
                        visMap.AddUnit(h_BID[i], unit);
                    }
                }
            }
            catch (NullReferenceException e)
            {
                Debug.WriteLine(e.InnerException);
            }
            //sw.Flush();
            //sw.Close();
            return visMap;

        }

        public static VisMap TweetSOMClustering(string mapID, Interval interval, VisMap lastMap = null)
        {
            int trainsetSize = interval.TweetsCount;
            //set the resolution of SOM map
            int width = 32;
            int height = 16;
            int neuronNum = width * height;
            int[] h_BID;
            float[] h_error;
            float[] h_weight;
            Stopwatch sw = new Stopwatch();
            Debug.WriteLine("Let's have SOM");
            sw.Start();

            if (File.Exists(config.Parameter.cacheMapDataDir + mapID))
            {
                StreamReader srCacheMap = new StreamReader(config.Parameter.cacheMapDataDir + mapID);
                h_BID = Array.ConvertAll(srCacheMap.ReadLine().Split(','), int.Parse);
                h_error = Array.ConvertAll(srCacheMap.ReadLine().Split(','), float.Parse);
                h_weight = Array.ConvertAll(srCacheMap.ReadLine().Split(','), float.Parse);
                srCacheMap.Close();
            }
            else
            {
                InitializeCUDA();

                float[] trainset = interval.GetHashVector(trainsetSize);
                //set the batch size
                int batch_size = trainsetSize;
                //set the number of iteration
                int iteration = 20;
                float lambda = 0.02f;
                float iterD = 1f;

                //use som train here
                float[] lastMapWeight = null;
                if (lastMap != null)
                {
                    lastMapWeight = lastMap.MapWeightInColumnMajor;
                }
                IntPtr pointer = SOMwithRandomMapping(config.Parameter.RmMatrix,
                                                        trainset,
                                                        lastMapWeight,
                                                        trainsetSize,
                                                        config.Parameter.HashDimension,
                                                        height,
                                                        width,
                                                        batch_size,
                                                        iteration,
                                                        lambda,
                                                        iterD);
                sw.Stop();
                Debug.WriteLine("SOM Finish");
                Debug.WriteLine("SOM Time Consuming :" + sw.ElapsedTicks / (decimal)Stopwatch.Frequency);

                sw.Restart();
                h_BID = new int[trainsetSize];
                Marshal.Copy(pointer, h_BID, 0, trainsetSize);

                h_error = new float[trainsetSize];
                Marshal.Copy(IntPtr.Add(pointer, trainsetSize * sizeof(int)), h_error, 0, trainsetSize);

                h_weight = new float[neuronNum * config.Parameter.DimensionAfterRandomMapping];
                Marshal.Copy(IntPtr.Add(pointer, 2 * trainsetSize * sizeof(int)), h_weight, 0, neuronNum * config.Parameter.DimensionAfterRandomMapping);
                somFree(pointer);
                StreamWriter swCacheMap = new StreamWriter(config.Parameter.cacheMapDataDir + mapID);
                swCacheMap.WriteLine(String.Join(",", h_BID));
                swCacheMap.WriteLine(String.Join(",", h_error));
                swCacheMap.WriteLine(String.Join(",", h_weight));
                swCacheMap.Close();
            }

            //*********************Check the marshal result ****************//
            //StreamReader sr = new StreamReader("D:\\SOMLog\\bid");
            //int k  = 0;
            //while (!sr.EndOfStream)
            //{
            //    int bid = int.Parse(sr.ReadLine());
            //    if (bid != h_BID[k])
            //        Debug.WriteLine("bid is wrong here!" + k.ToString());
            //    ++k;
            //}
            //sr = new StreamReader("D:\\SOMLog\\weights_in_columnmajor");
            //k = 0;
            //while (!sr.EndOfStream)
            //{
            //    string[] s = sr.ReadLine().Split(' ');
            //    for (int j = 0; j < config.Parameter.DimensionAfterRandomMapping; ++j)
            //    {
            //        if (Math.Abs(float.Parse(s[j]) - h_weight[j * neuronNum + k]) > 1e-6)
            //        {
            //            Debug.WriteLine("weight is wrong here!" + k.ToString());
            //        }
            //    }
            //    ++k;
            //}
            //*********************Check the marshal result end**************//

            //construct the som map for visualization
            VisMap visMap = new VisMap(mapID, width, height, h_weight, h_BID, h_error, interval);
            try
            {
                for (int i = 0; i < trainsetSize; ++i)
                {
                    //sw.WriteLine(h_output[i]);
                    if (!visMap.TryAddTweetToUnit(h_BID[i], h_error[i], interval.Tweets[i]))
                    {
                        float[] unitWeightVector = new float[config.Parameter.DimensionAfterRandomMapping];
                        for (int j = 0, lenj = config.Parameter.DimensionAfterRandomMapping; j < lenj; ++j)
                        {
                            unitWeightVector[j] = h_weight[j * neuronNum + h_BID[i]];
                        }
                        Unit unit = new Unit(h_BID[i] % width, h_BID[i] / width, h_BID[i], unitWeightVector, interval);
                        Tweet tweet = interval.Tweets[i];
                        unit.AddTweet(h_error[i], tweet);
                        visMap.AddUnit(h_BID[i], unit);
                    }
                }
            }
            catch (NullReferenceException e)
            {
                Debug.WriteLine(e.InnerException);
            }
            sw.Stop();
            Debug.WriteLine("After_SOM time consuming : " + sw.ElapsedTicks / (decimal)Stopwatch.Frequency);
            //sw.Flush();
            //sw.Close();
            return visMap;
        }

        public class GPUFindBIDPack
        {
            public int[] BID { get; set; }
            public float[] error { get; set; }
        }
        public static GPUFindBIDPack GPUFindBID(float[] inputVector, int inputSize, float[] weight, int weightSize)
        {
            InitializeCUDA();

            IntPtr pointer = FindBID(config.Parameter.RmMatrix,
                                    inputVector, inputSize, config.Parameter.HashDimension,
                                    weight, weightSize);
            Debug.WriteLine("SOM Finish");

            int[] h_BID = new int[inputSize];
            Marshal.Copy(pointer, h_BID, 0, inputSize);

            float[] h_error = new float[inputSize];
            Marshal.Copy(IntPtr.Add(pointer, inputSize * sizeof(int)), h_error, 0, inputSize);
            Marshal.FreeHGlobal(pointer);

            return new GPUFindBIDPack() { BID = h_BID, error = h_error };
        }

        public static void TweetSOMUpdateMap(VisMap refineMap)
        {
            InitializeCUDA();

            Interval interval = refineMap.Interval;
            int trainsetSize = interval.TweetsCount;
            float[] trainset = interval.GetHashVector(trainsetSize);
            Debug.WriteLine("Set the parameter for SOM");
            //set the resolution of SOM map
            int width = refineMap.Width;
            int height = refineMap.Height;
            int neuronNum = width * height;
            //set the batch size
            int batch_size = trainsetSize;

            Debug.WriteLine("Let's have SOM");
            //use som train here
            IntPtr pointer = SOMRefinewithRandomMapping(config.Parameter.RmMatrix,
                                                        trainset,
                                                        refineMap.BID,
                                                        refineMap.MapWeightInColumnMajor,
                                                        trainsetSize,
                                                        config.Parameter.HashDimension,
                                                        height,
                                                        width,
                                                        batch_size);
            Debug.WriteLine("SOM Finish");

            float[] h_weight = new float[neuronNum * config.Parameter.DimensionAfterRandomMapping];
            Marshal.Copy(pointer, h_weight, 0, neuronNum * config.Parameter.DimensionAfterRandomMapping);
            Marshal.FreeHGlobal(pointer);

            refineMap.MapWeightInColumnMajor = h_weight;
        }

    }
}