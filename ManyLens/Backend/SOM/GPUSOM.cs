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
        public static extern int InitializeCUDA();

        //Do cleanup when close the program
        [DllImport("ManyLens-SOM_CUDA.dll")]
        public static extern int CleanUp();

        [DllImport("ManyLens-SOM_CUDA.dll")]
        public static extern IntPtr SOMwithRandomMapping(float[] h_gaussin,
                                                         float[] h_inputSet,
                                                         int input_set_size,
                                                         int dimension,
                                                         int height,
                                                         int width,
                                                         int batch_size,
                                                         int epochNum,
                                                         float lambda,
                                                         float iterNum);

        [DllImport("ManyLens-SOM_CUDA.dll")]
        public static extern void somFree(IntPtr pointer);

        public static VisMap TweetSOM(Interval interval, string rootPath)
        {
            InitializeCUDA();
            //generate the random matrix for random mapping
            //interval.RMMatrix = config.Parameter.RmMatrix;

            int trainsetSize = interval.TweetsCount;
            float[] trainset = interval.GetHashVector(trainsetSize);
            Debug.WriteLine("Set the parameter for SOM");
            //set the resolution of SOM map
            int width = 32;
            int height = 16;
            //set the batch size
            int batch_size = trainsetSize;
            //set the number of iteration
            int iteration = 20;
            float lambda = 0.02f;
            float iterD = 1f;

            Debug.WriteLine("Let's have SOM");
            //use som train here
            IntPtr pointer = SOMwithRandomMapping(config.Parameter.RmMatrix,
                    trainset,
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

            float[] h_weight = new float[width * height * config.Parameter.DimensionAfterRandomMapping];
            IntPtr newPointer = IntPtr.Add(pointer, trainsetSize * sizeof(int));
            Marshal.Copy(newPointer, h_weight, 0, width * height * config.Parameter.DimensionAfterRandomMapping);
            Marshal.FreeHGlobal(pointer);

            StreamReader sr = new StreamReader("D:\\SOMLog\\bid");
            int k  = 0;
            while (!sr.EndOfStream)
            {
                int bid = int.Parse(sr.ReadLine());
                if (bid != h_BID[k])
                    Debug.WriteLine("bid is wrong here!" + k.ToString());
                ++k;
            }
            sr = new StreamReader("D:\\SOMLog\\weights_in_columnmajor");
            k = 0;
            while (!sr.EndOfStream)
            {
                string[] s = sr.ReadLine().Split(' ');
                for (int j = 0; j < config.Parameter.DimensionAfterRandomMapping; ++j)
                {
                    if (Math.Abs(float.Parse(s[j]) - h_weight[j * width * height + k]) > 1e-6)
                    {
                        Debug.WriteLine("weight is wrong here!" + k.ToString());
                    }
                }
                ++k;
            }

            //construct the som map for visualization
            VisMap visMap = new VisMap(interval.ID + "_0", width, height, h_weight, interval);
            try
            {
                for (int i = 0; i < trainsetSize; ++i)
                {
                    //sw.WriteLine(h_output[i]);
                    if (!visMap.TryAddTweetToUnit((int)h_BID[i], interval.Tweets[i]))
                    {
                        Unit unit = new Unit((int)h_BID[i] % width, (int)h_BID[i] / width, (int)h_BID[i], interval);
                        Tweet tweet = interval.Tweets[i];
                        unit.AddTweet(tweet);
                        visMap.AddUnit((int)h_BID[i], unit);
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

        public static VisMap TestTweetSOM(Interval interval, string rootPath)
        {
            
            int trainsetSize = interval.TweetsCount;
            int width = 32;
            int height = 16;

            StreamReader sr = new StreamReader(rootPath + "Backend\\DataBase\\somOutput_"+interval.ID+".json");
            //construct the som map for visualization
            VisMap visMap = new VisMap(interval.ID + "_0", width, height, new float[100] ,interval);
            int i = 0;
            while (!sr.EndOfStream)
            {
                int BID = int.Parse(sr.ReadLine());
                if (!visMap.TryAddTweetToUnit(BID, interval.Tweets[i]))
                {
                    Unit unit = new Unit(BID % width, BID/ width,BID, interval);
                    Tweet tweet = interval.Tweets[i];
                    unit.AddTweet(tweet);
                    visMap.AddUnit(BID, unit);
                }
                i++;
            }  
            return visMap;
        
        }

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