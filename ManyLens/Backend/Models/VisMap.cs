using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class VisMap
    {
        private string visMapId;
        private Dictionary<int, Unit> units = null;
        private int maxTweetCount = -1;
        private float[] rmMatrix;
        private int width;
        private int height;
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
        public virtual List<Unit> Units
        {
            get
            {
                return this.units.Values.ToList();
            }
            private set
            {
                this.units = new Dictionary<int, Unit>();
                int count = value.Count;
                for (--count; count >= 0; --count)
                {
                    Unit unit = value[count];
                    this.units.Add(unit.UnitID, unit);
                }
            }
        }
        public float[] RMMatrix
        {
            get
            {
                return this.rmMatrix;
            }
            set
            {
                this.rmMatrix = value;
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
        #endregion

        public VisMap(string visMapID, int width, int height, VisMap parentNote = null)
        {
            this.ParentNote = parentNote;
            this.VisMapID = visMapID;
            this.Width = width;
            this.Height = height;
            this.units = new Dictionary<int, Unit>();
        }

        public void AddUnit(int unitID, Unit unit)
        {
            this.units.Add(unitID, unit);
        }

        public bool TryAddTweetToUnit(int unitID, Tweet tweet, float[] tfidfVector)
        {
            if (units.ContainsKey(unitID))
            {
                units[unitID].AddTweet(tweet, tfidfVector);
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
                                                count = unit.TweetsCount,
                                                contents = unit.TweetContents,
                                                labels = unit.WordLabels,
                                                x = unit.X,
                                                y = unit.Y,
                                                tweetIDs = unit.TweetIDs
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
    }
}