using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    //Maybe delete later
    public class Mark 
    {
        public string id { set; get; }
        // 0 -- null
        // 1 -- begin
        // 2 -- end
        // 3 -- end&begin
        // 4 -- insed
        public uint type { set; get; }
        public string beg { set; get; }
        public string end { set; get; }
    }
    public class Point
    {
        public double value { set; get; }

        public Mark mark { set; get; }
    }

    public class UnitsData
    {
        public int unitID { set; get; }
        public int count{set;get;}
        public string contents{set;get;}
        public string labels{set;get;}
        public int x{set;get;}
        public int y{set;get;}
        public string tweetIDs{set;get;}

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