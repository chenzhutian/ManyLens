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
        public static string fifaFile = RootFolder + "Backend\\DataBase\\FIFACASESample";
        public static string ebolaFile = RootFolder + "Backend\\DataBase\\EbolaFullYearCaseSample";
        public static string cities1000File = RootFolder + "Backend\\DataBase\\GEODATA\\cities1000short";
        public static string stopwordFile = RootFolder + "Backend\\DataBase\\PREPROCESSINGDICT\\stopwords";
        public static string twitterKeysFile = RootFolder + "Backend\\DataBase\\TWITTERKEY";

        //public static string tweetFile = ebolaFile;
        private static int timeSpan = 2;
        private static int lastTimeSpan = 2;
        private static int hashDimension = 4096;
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
            set { Parameter.lastTimeSpan = Parameter.timeSpan; Parameter.timeSpan = value > 3 ? 3 : value < 0 ? 0 : value; }
        }
        public static int LastTimeSpan
        {
            get { return Parameter.lastTimeSpan; }
        }

        public static string[] intervals = { "Month", "Day", "Hour", "Minute" };
    }
}
