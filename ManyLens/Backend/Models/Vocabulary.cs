using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Vocabulary
    {
        private Dictionary<string, int> idOfWords = null;
        private Dictionary<string, int> dfOfWords = null;
        private Dictionary<string, int> frequenceOfWords = null;
        private Dictionary<string, double> pOfWords = null;
        private List<string> most50 = null;

        #region Getter&Setter
        public Dictionary<string, int> IdOfWords
        {
            get
            {
                return this.idOfWords;
            }
            private set
            {
                this.idOfWords = value;
            }
        }
        public Dictionary<string, int> DfOfWords
        {
            get
            {
                return this.dfOfWords;
            }
            private set
            {
                this.dfOfWords = value;
            }
        }
        public Dictionary<string, int> FrequenceOfWords
        {
            get { return frequenceOfWords; }
            private set { frequenceOfWords = value; }
        }
        public int Dimension
        {
            get
            {
                if (idOfWords != null)
                    return idOfWords.Count;
                return -1;
            }
        }
        public Dictionary<string, double> PofWords
        {
            get
            {
                if (this.pOfWords == null)
                {
                    this.pOfWords = new Dictionary<string, double>();
                    double sum = 0;
                    List<int> values = this.FrequenceOfWords.Values.ToList();
                    for (int i = 0, len = values.Count; i < len; ++i)
                    {
                        sum += values[i];
                    }
                    foreach (KeyValuePair<string, int> item in this.FrequenceOfWords)
                    {
                        this.pOfWords.Add(item.Key, (double)item.Value / sum);
                    }

                    this.pOfWords =  (from item in this.pOfWords
                     orderby item.Value descending
                     select item).ToDictionary(pair => pair.Key, pair => pair.Value);
                }
                return this.pOfWords;
            }
        }
        public List<string> Most50
        {
            get
            {
                if (this.most50 == null)
                {
                    this.most50 = new List<string>();
                    List<string> keys = this.PofWords.Keys.ToList();
                    int t = 0;
                    for (int i = 0; t < 10; ++i)
                    { 
                        if(keys[i] == "bra" || keys[i] == "ger")
                            continue;
                        this.most50.Add(keys[i]);
                        ++t;
                    }
                }
                return this.most50; 
            }
 
        }
        #endregion

        public Vocabulary(Dictionary<string, int> idOfWrods, Dictionary<string, int> dfOfWords,Dictionary<string,int> frequenceOfWords)
        {
            this.IdOfWords = idOfWrods;
            this.DfOfWords = dfOfWords;
            this.FrequenceOfWords = frequenceOfWords;
        }
        public int GetIDofWord(string word)
        {
            if (this.IdOfWords == null)
                return -1;
            return this.IdOfWords[word];
        }
        public int GetDFofWord(string word)
        {
            if (this.DfOfWords == null)
                return -1;
            return this.DfOfWords[word];
        }

        public Dictionary<int, int> MapTo(Vocabulary v)
        {
            Dictionary<int, int> map = new Dictionary<int, int>();
            foreach (KeyValuePair<string, int> item in idOfWords)
            {
                string word = item.Key;
                int idInMe = item.Value;
                int idInHim = v.IdOfWords[word];
                map.Add(idInMe, idInHim);
            }
            return map;
        }
    }
}