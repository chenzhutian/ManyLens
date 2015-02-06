using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Vocabulary
    {
        private string id;
        private Dictionary<string, int> idOfWords = null;
        private Dictionary<string, int> dfOfWords = null;

        #region Getter&Setter
        private string ID { get; set; }
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
        public int Dimension
        {
            get
            {
                if (idOfWords != null)
                    return idOfWords.Count;
                return -1;
            }
            private set { }
        }
        #endregion

        private Vocabulary() { }
        public Vocabulary(Dictionary<string, int> idOfWrods, Dictionary<string, int> dfOfWords, string id = null)
        {
            this.IdOfWords = idOfWrods;
            this.DfOfWords = dfOfWords;
            if (id != null)
                this.id = id;
        }
        public int GetIDofWord(string word)
        {
            if (this.idOfWords == null)
                return -1;
            return this.idOfWords[word];
        }
        public int GetDFofWord(string word)
        {
            if (this.dfOfWords == null)
                return -1;
            return this.dfOfWords[word];
        }
    }
}