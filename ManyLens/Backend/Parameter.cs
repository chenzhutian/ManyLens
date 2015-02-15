using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManyLens
{
    class Parameter
    {
        private static int _timeSpan = 3;
        private static string tweetfile = "dtext-tweets-onedriver.txt";
        public static double declineBeta = 0.5;
        public static int maxPerSegment = 5000;
        public static int maxHigherPerSegment = 5000;
        public static int maxUserPerSegment = 5000;
        public static int maxWordPerSegment = 5000;
        public static bool segmentAggregate = false;

        public static int timeSpan
        {
            get { return _timeSpan; }
            set { _timeSpan = value > 4 ? 4 : value < 1 ? 1 : value; }
        }

        public static string originalTweet
        {
            get { return tweetfile; }
            set { tweetfile = value; }
        }

        public static string[] intervals = { "Month", "Day", "Hour", "Minute" };
    }
}
