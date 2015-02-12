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
            int dimensionAfterRM = 1024;
            GaussianRandom grd = new GaussianRandom(Math.Sqrt(1.0 / (double)dimensionAfterRM));
            float[] rmMatrix = grd.RandomMapping(dimensionAfterRM, interval.Dimension);
            interval.RMMatrix = rmMatrix;

            int trainsetSize = interval.TweetsCount;
            float[] trainset = interval.GetTFIDFVector(trainsetSize);
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
            IntPtr pointer = SOMwithRandomMapping(rmMatrix,
                    trainset,
                    trainsetSize,
                    interval.Dimension,
                    height,
                    width,
                    batch_size,
                    iteration,
                    lambda,
                    iterD);
            Debug.WriteLine("SOM Finish");
            int[] h_output = new int[trainsetSize];
            Marshal.Copy(pointer, h_output, 0, trainsetSize);

            //construct the som map for visualization
            VisMap visMap = new VisMap(interval.ID+"_0",width,height);
            try
            {
                for (int i = 0; i < trainsetSize; ++i)
                {
                    if (!visMap.TryAddTweetToUnit(h_output[i], interval.Tweets[i], interval.GetTFIDFVectorAt(i)))
                    {
                        Unit unit = new Unit(h_output[i] % width, h_output[i] / width, h_output[i]);
                        float[] tfv = interval.GetTFIDFVectorAt(i);
                        unit.AddTweet(interval.Tweets[i], tfv);
                        visMap.AddUnit(h_output[i], unit);
                    }
                }
                visMap.RMMatrix = rmMatrix;
            }
            catch (ArgumentException e)
            {
                Debug.WriteLine(e.InnerException);
            }
            return visMap;
        }

        public static VisMap TweetReOrganizeSOM(VisMap visMap,int[] selectedUnits)
        {
            InitializeCUDA();
            float[] rmMatrix = visMap.RMMatrix;
            List<float[]> rawTrainset = new List<float[]>();
            List<Tweet> rawTweets = new List<Tweet>();   

            for (int i = selectedUnits.Length - 1; i >= 0; --i)
            {
                Unit unit = visMap.GetUnitAt(selectedUnits[i]);
                rawTrainset.AddRange(unit.TFIDFVectors);
                rawTweets.AddRange(unit.Tweets);
            }

            int trainsetSize = rawTrainset.Count;
            int dimension = rawTrainset[0].Length;
            float[] trainset = new float[dimension * trainsetSize];
            for (int i = 0; i < trainsetSize; ++i)
            {
                for (int j = 0; j < dimension; ++j)
                {
                    trainset[j + i * dimension] = rawTrainset[i][j];
                }
            }

            //set the resolution of SOM map
            int width = 10;
            int height = 10;

            //set the batch size
            int batch_size = trainsetSize;
            //set the number of iteration
            int iteration = 20;
            float lambda = 0.05f;
            float iterD = 1f;

            //use som train here
            IntPtr pointer = SOMwithRandomMapping(rmMatrix,
                    trainset,
                    trainsetSize,
                    dimension,
                    height,
                    width,
                    batch_size,
                    iteration,
                    lambda,
                    iterD);

            int[] h_output = new int[trainsetSize];
            Marshal.Copy(pointer, h_output, 0, trainsetSize);

            #region construct the som map for visualization
            //string sNum = (1+int.Parse(visMap.VisMapID[visMap.VisMapID.Length - 1].ToString())).ToString();
            string sNum = visMap.ChildrenNum.ToString();
            string visMapID = visMap.VisMapID+"_"+sNum;
            
            VisMap newVisMap = new VisMap(visMapID,width,height,visMap);
            for (int i = 0; i < trainsetSize; ++i)
            {
                if (!newVisMap.TryAddTweetToUnit(h_output[i], rawTweets[i], rawTrainset[i]))
                {
                    Unit unit = new Unit(h_output[i] % width, h_output[i] / width, h_output[i]);
                    unit.AddTweet(rawTweets[i], rawTrainset[i]);
                    newVisMap.AddUnit(h_output[i], unit);
                }
            }
            #endregion

            return newVisMap;
        }
    }
}