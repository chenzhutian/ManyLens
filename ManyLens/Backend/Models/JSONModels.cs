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
        public double trueValue { set; get; } 
        public bool isPeak { set; get; }
        public uint type { get; set; }
        public string beg { get; set; }
        public string end { get; set; }
    }

    public class UnitsData
    {
        public int unitID { set; get; }
        public int value{set;get;}
        public int x { set; get; }
        public int y { set; get; }
        public string mapID { get; set; }
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