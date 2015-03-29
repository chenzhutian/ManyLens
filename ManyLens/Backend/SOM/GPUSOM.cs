﻿using System;
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
                                            float[] input_vector, int input_set_size,int dimension,
                                            float[] weights,int weights_size);

        [DllImport("ManyLens-SOM_CUDA.dll")]
        private static extern void somFree(IntPtr pointer);



        public static VisMap TweetSOMClassification(string mapID,Interval interval, VisMap classifier)
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
            Marshal.FreeHGlobal(pointer);


            float[] h_weight = classifier.MapWeightInColumnMajor;

            //construct the som map for visualization
            VisMap visMap = new VisMap(mapID, width, height,h_weight, h_BID,h_error,interval);
            try
            {
                for (int i = 0; i < trainsetSize; ++i)
                {
                    //sw.WriteLine(h_output[i]);
                    if (!visMap.TryAddTweetToUnit(h_BID[i], h_error[i],interval.Tweets[i]))
                    {
                        float[] unitWeightVector = new float[config.Parameter.DimensionAfterRandomMapping];
                        for (int j = 0, lenj = config.Parameter.DimensionAfterRandomMapping; j < lenj; ++j)
                        {
                            unitWeightVector[j] = h_weight[j * neuronNum + h_BID[i]];
                        }
                        Unit unit = new Unit(h_BID[i] % width, h_BID[i] / width, h_BID[i], unitWeightVector,interval);
                        Tweet tweet = interval.Tweets[i];
                        unit.AddTweet(h_error[i],tweet);
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

        public static VisMap TweetSOMClustering(string mapID,Interval interval, VisMap lastMap = null)
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
            //set the number of iteration
            int iteration = 20;
            float lambda = 0.02f;
            float iterD = 1f;

            Debug.WriteLine("Let's have SOM");
            //use som train here
            float[] lastMapWeight = null;
            if (lastMap != null) {
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

            Debug.WriteLine("SOM Finish");

            int[] h_BID = new int[trainsetSize];
            Marshal.Copy(pointer, h_BID, 0, trainsetSize);

            float[] h_error = new float[trainsetSize];
            Marshal.Copy(IntPtr.Add(pointer, trainsetSize * sizeof(int)), h_error, 0,trainsetSize);

            float[] h_weight = new float[neuronNum * config.Parameter.DimensionAfterRandomMapping];
            Marshal.Copy( IntPtr.Add(pointer, 2* trainsetSize * sizeof(int)), h_weight, 0, neuronNum * config.Parameter.DimensionAfterRandomMapping);
            somFree(pointer);

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
            VisMap visMap = new VisMap(mapID, width, height, h_weight, h_BID, h_error,interval);
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
                        Unit unit = new Unit(h_BID[i] % width, h_BID[i] / width, h_BID[i],unitWeightVector, interval);
                        Tweet tweet = interval.Tweets[i];
                        unit.AddTweet(h_error[i],tweet);
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

        public class GPUFindBIDPack
        {
            public int[] BID { get; set; }
            public float[] error { get; set; }
        }
        public static GPUFindBIDPack GPUFindBID(float[] inputVector, int inputSize,float[] weight,int weightSize)
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

            return new GPUFindBIDPack() { BID=h_BID, error = h_error};
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

        //public static VisMap TestTweetSOM(Interval interval, string rootPath)
        //{
            
        //    int trainsetSize = interval.TweetsCount;
        //    int width = 32;
        //    int height = 16;

        //    StreamReader sr = new StreamReader(rootPath + "Backend\\DataBase\\somOutput_"+interval.ID+".json");
        //    //construct the som map for visualization
        //    VisMap visMap = new VisMap(interval.ID + "_0", width, height, new float[1] ,interval);
        //    int i = 0;
        //    while (!sr.EndOfStream)
        //    {
        //        int BID = int.Parse(sr.ReadLine());
        //        if (!visMap.TryAddTweetToUnit(BID, ,interval.Tweets[i]))
        //        {
        //            Unit unit = new Unit(BID % width, BID/ width,BID, interval);
        //            Tweet tweet = interval.Tweets[i];
        //            unit.AddTweet(tweet);
        //            visMap.AddUnit(BID, unit);
        //        }
        //        i++;
        //    }  
        //    return visMap;
        
        //}

        //public static VisMap TweetReOrganizeSOM(VisMap visMap,int[] selectedUnits)
        //{
        //    InitializeCUDA();
        //   // float[] rmMatrix = visMap.RMMatrix;
        //    List<float[]> rawTrainset = new List<float[]>();
        //    List<Tweet> rawTweets = new List<Tweet>();   

        //    for (int i = selectedUnits.Length - 1; i >= 0; --i)
        //    {
        //        Unit unit = visMap.GetUnitAt(selectedUnits[i]);
        //        rawTrainset.AddRange(unit.TFIDFVectors);
        //        rawTweets.AddRange(unit.Tweets);
        //    }

        //    int trainsetSize = rawTrainset.Count;
        //    int dimension = rawTrainset[0].Length;
        //    float[] trainset = new float[dimension * trainsetSize];
        //    for (int i = 0; i < trainsetSize; ++i)
        //    {
        //        for (int j = 0; j < dimension; ++j)
        //        {
        //            trainset[j + i * dimension] = rawTrainset[i][j];
        //        }
        //    }

        //    //set the resolution of SOM map
        //    int width = 10;
        //    int height = 10;

        //    //set the batch size
        //    int batch_size = trainsetSize;
        //    //set the number of iteration
        //    int iteration = 20;
        //    float lambda = 0.05f;
        //    float iterD = 1f;

        //    //use som train here
        //    IntPtr pointer = SOMwithRandomMapping(config.Parameter.RmMatrix,
        //            trainset,
        //            trainsetSize,
        //            dimension,
        //            height,
        //            width,
        //            batch_size,
        //            iteration,
        //            lambda,
        //            iterD);

        //    int[] h_output = new int[trainsetSize];
        //    Marshal.Copy(pointer, h_output, 0, trainsetSize);

        //    #region construct the som map for visualization
        //    //string sNum = (1+int.Parse(visMap.VisMapID[visMap.VisMapID.Length - 1].ToString())).ToString();
        //    string sNum = visMap.ChildrenNum.ToString();
        //    string visMapID = visMap.VisMapID+"_"+sNum;
            
        //    VisMap newVisMap = new VisMap(visMapID,width,height,visMap.Interval,visMap);
        //    for (int i = 0; i < trainsetSize; ++i)
        //    {
        //        if (!newVisMap.TryAddTweetToUnit(h_output[i], rawTweets[i]))
        //        {
        //            Unit unit = new Unit(h_output[i] % width, h_output[i] / width, h_output[i],visMap.Interval);
        //            Tweet tweet = rawTweets[i];
        //            unit.AddTweet(tweet);
        //            newVisMap.AddUnit(h_output[i], unit);
        //        }
        //    }
        //    #endregion

        //    return newVisMap;
        //}
    }
}