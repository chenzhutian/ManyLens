using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class VisMap
    {
        private string visMapId;
        private Dictionary<int, Unit> units = null;
        private int maxTweetCount = -1;
        private int width;
        private int height;
        private float[] mapWeightInColumnMajor = null;

        private Interval interval;

        private VisMap parentNote = null;
        private int childNum = 0;

        #region Getter &Setter
        public string VisMapID
        {
            get
            {
                return this.visMapId;
            }
            private set
            {
                this.visMapId = value;
            }
        }
        public DateTime MapDate
        {
            get
            {
                return this.Interval.BeginDate;
            }
        }
        public Interval Interval
        {
            get
            {
                return this.interval;
            }
        }
        public int MaxTweetCount
        {
            get
            {
                return this.maxTweetCount;
            }
            private set
            {
                this.maxTweetCount = value;
            }
        }
        public int Width
        {
            get
            {
                return this.width;
            }
            set
            {
                this.width = value;
            }
        }
        public int Height
        {
            get
            {
                return this.height;
            }
            set
            {
                this.height = value;
            }
        }
        public VisMap ParentNote
        {
            get
            {
                return this.parentNote;
            }
            set
            {
                if (value != null)  //add one to the children number
                    value.ChildrenNum++;
                this.parentNote = value;
            }
        }
        public int ChildrenNum
        {
            get
            {
                return this.childNum;
            }
            set
            {
                this.childNum = value;
            }
        }
        public float[] MapWeightInColumnMajor
        {
            get
            {
                return this.mapWeightInColumnMajor;
            }
            private set
            {
                if (value.Length != this.Width * this.Height * config.Parameter.DimensionAfterRandomMapping)
                    throw new Exception("the size of map weight matrix is wrong!");
                else 
                {
                    this.mapWeightInColumnMajor = value;
                }
            }
        }
        #endregion

        public VisMap(string visMapID, int width, int height, float[] mapWeight, Interval interval, VisMap parentNote = null)
        {
            this.ParentNote = parentNote;
            this.VisMapID = visMapID;
            this.interval = interval;
            this.Width = width;
            this.Height = height;
            this.MapWeightInColumnMajor = mapWeightInColumnMajor;
            this.units = new Dictionary<int, Unit>();
            this.interval.VisMap = this;
        }

        public void AddUnit(int unitID, Unit unit)
        {
            this.units.Add(unitID, unit);
        }

        public bool TryAddTweetToUnit(int unitID, Tweet tweet)
        {
            if (units.ContainsKey(unitID))
            {
                units[unitID].AddTweet(tweet);
                return true;
            }
            return false;
        }

        public Unit GetUnitAt(int index)
        {
            return this.units[index];
        }

        public void RemoveUnitAt(int index)
        {
            this.units.Remove(index);
        }

        public VISData GetVisData()
        {

            List<int> keys = units.Keys.ToList();
            List<UnitsData> unitData = new List<UnitsData>();
            try
            {
                for (int i = keys.Count - 1; i >= 0; --i)
                {
                    int key = keys[i];
                    Unit unit = units[key];
                    if (unit.TweetsCount > this.maxTweetCount)
                    {
                        this.maxTweetCount = unit.TweetsCount;
                    }

                    unitData.Add(new UnitsData()
                    {
                        unitID = unit.UnitID,
                        value = unit.TweetsCount,
                        x = unit.X,
                        y = unit.Y,
                        mapID = this.VisMapID
                    });
                }

                VISData visdata = new VISData()
                                             {
                                                 mapID = this.VisMapID,
                                                 width = this.Width,
                                                 height = this.Height,
                                                 max = this.maxTweetCount,
                                                 min = 0,
                                                 unitsData = unitData
                                             };

                return visdata;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.InnerException);
                return null;
            }
        }

    }
}