using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    //Maybe delete later
    //public class Mark 
    //{
    //    public string id { set; get; }
    //    // 0 -- null
    //    // 1 -- begin
    //    // 2 -- end
    //    // 3 -- end&begin
    //    // 4 -- insed

    //    public uint type { set; get; }
    //    public string beg { set; get; }
    //    public string end { set; get; }
    //}
    public class Network
    {
        public List<Link> links { set; get; }
        public List<Node> nodes { set; get; }
    }

    public class Node
    {
        public string userName { set;get; }
        public double x {set;get;}
        public double y {set;get;}
    }

    public class Link
    {
        public int source { set; get; }
        public int target { set; get; }
    }


    public class Point
    {
        public string id { set; get; }
        public double value { set; get; }
        public bool isPeak { set; get; }
        public uint type { get; set; }
        public string beg { get; set; }
        public string end { get; set; }
    }

    public class UnitsDataForLens
    {
        public List<int> unitsID { set; get; }
        public List<KeyValuePair<string, int>> keywordsDistribute { set; get; }
        public List<KeyValuePair<int, int>> tweetLengthDistribute { set; get; }
        public List<string> contents { set; get; }
        public List<KeyValuePair<string, int>> hashTagDistribute { set; get; }
        public Network retweetNetwork { set; get; }
        public List<KeyValuePair<string, int>> userTweetsDistribute { set; get; }
    }

    public class UnitsData
    {
        public int unitID { set; get; }
        public int count{set;get;}
        public int x { set; get; }
        public int y { set; get; }
        public string mapID { get; set; }
        //public UnitsDataForLens lensData { set; get; }
        //public List<string> tweetIDs{set;get;}
    }

    public class VISData
    {
        public string mapID { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public int max { set; get; }
        public int min { set; get; }
        public List<UnitsData> unitsData { set; get; }
    }
}