using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManyLens.config
{
    class Parameter
    {
        private static string rootFolder = AppDomain.CurrentDomain.SetupInformation.ApplicationBase;
        private static string fifaFile = RootFolder + "Backend\\DataBase\\FIFACASESample";
        private static string ebolaFile = RootFolder + "Backend\\DataBase\\EbolaFullYearCaseSample";
        public static string tweetFile = ebolaFile;
        private static int timeSpan =2;
        private static int hashDimension = 8192;
        private static int dimensionAfterRandomMapping = 1024;
        private static float[] rmMatrix = myMath.GaussianRandom.GetRMMatrix(DimensionAfterRandomMapping, HashDimension);
        public static double filterWords = 0.3;

        public static string RootFolder
        {
            get { return Parameter.rootFolder; }
            set { Parameter.rootFolder = value; }
        }
        public static int HashDimension
        {
            get { return Parameter.hashDimension; }
            set { Parameter.hashDimension = value; }
        }
        public static int DimensionAfterRandomMapping
        {
            get { return Parameter.dimensionAfterRandomMapping; }
            set { Parameter.dimensionAfterRandomMapping = value; }
        }
        public static float[] RmMatrix
        {
            get { return Parameter.rmMatrix; }
            set { Parameter.rmMatrix = value; }
        }
        public static int TimeSpan
        {
            get { return Parameter.timeSpan; }
            set { Parameter.timeSpan = value > 4 ? 4 : value < 1 ? 1 : value; }
        }

        public static string[] intervals = { "Month", "Day", "Hour", "Minute" };
    }
}
