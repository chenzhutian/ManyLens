using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace ManyLens.myMath
{
    public class GaussianRandom
    {
        int iset;
        double gset;
        Random r1, r2;
        double V;
        double E;

        public GaussianRandom(double V = 1.0, double E = 0.0)
        {
            r1 = new Random(unchecked((int)DateTime.Now.Ticks));
            r2 = new Random(~unchecked((int)DateTime.Now.Ticks));
            this.V = V;
            this.E = E;
            iset = 0;
        }
        public double Next()
        {
            return this.Generate() * this.V + this.E;
        }

        public float Nextf()
        {
            return (float)(this.Generate() * this.V + this.E);
        }

        //public float[] RandomMapping(int dimensionAfterRM, int dimensionBeforeRM)
        //{

        //    float[] matrix = new float[dimensionAfterRM * dimensionBeforeRM];
        //    for (int i = 0; i < dimensionAfterRM; ++i)
        //    {
        //        for (int j = 0; j < dimensionBeforeRM; ++j)
        //            matrix[j * dimensionAfterRM + i] = (float)(this.Generate() * this.V);
        //    }
        //    return matrix;
        //}

        private double Generate()
        {
            double rsq, v1, v2;
            if (iset == 0)
            {
                do
                {
                    v1 = 2.0 * r1.NextDouble() - 1.0;
                    v2 = 2.0 * r2.NextDouble() - 1.0;
                    rsq = v1 * v1 + v2 * v2;
                } while (rsq >= 1.0 || rsq == 0.0);

                rsq = Math.Sqrt(-2.0 * Math.Log(rsq) / rsq);
                gset = v1 * rsq;
                iset = 1;
                return v2 * rsq;
            }
            else
            {
                iset = 0;
                return gset;
            }
        }


        public static float[] GetRMMatrix(int dimensionAfterRM, int dimensionBeforeRM)
        {
            GaussianRandom grd = new GaussianRandom(Math.Sqrt(1.0 / (double)dimensionAfterRM));
            float[] matrix = new float[dimensionAfterRM * dimensionBeforeRM];
            for (int i = 0; i < dimensionAfterRM; ++i)
            {
                for (int j = 0; j < dimensionBeforeRM; ++j)
                    matrix[j * dimensionAfterRM + i] = (float)(grd.Generate() * grd.V);
            }
            return matrix;
        }
    }
}